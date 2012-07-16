﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using CommonJobs.Raven.Mvc;
using CommonJobs.Infrastructure.Indexes;
using CommonJobs.ContentExtraction;
using CommonJobs.ContentExtraction.Extractors;
using CommonJobs.Raven.Mvc.Authorize;

namespace CommonJobs.Mvc.UI
{
    public class MvcApplication : CommonJobsApplication
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //hack: debe haber una forma más prolija de hacer esto, la idea es que si llega un request externo a 
            //http://dominio/angulardemo/... siempre lo reciba nuestra página principal de angular
            //"requires server-side configuration" (http://docs.angularjs.org/guide/dev_guide.services.$location)
            routes.MapRoute(
                "AngularApp",
                "angulardemo/{*pathInfo}",
                new { controller = "AngularApp", action = "Index", pathInfo = UrlParameter.Optional } // Parameter defaults
            );
            
            routes.MapRoute(
                "Shared", // Route name
                "{controller}/{action}/shared/{sharedCode}/{*id}", // URL with parameters
                new { controller = "Home", action = "Index", id = UrlParameter.Optional } // Parameter defaults
            );

            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{*id}", // URL with parameters
                new { controller = "Home", action = "Index", id = UrlParameter.Optional } // Parameter defaults
            );
        }

        protected override System.Reflection.Assembly[] GetIndexAssemblies()
        {
            return new[] { typeof(NullIndex).Assembly };
        }
        
        protected void Application_Start()
        {
            //TODO: acá se podrían invocar las migraciones automáticas
            
            //TODO: hacer esto con algo mejor que un singleton
            ContentExtractionConfiguration.Current.Clear();
            ContentExtractionConfiguration.Current.AddRange(new IContentExtractor[] {
                new PlainTextContentExtractor(), //I prefeer my own plain text extractor than IFilter. It is ugly but it reads fine UTF8 without BOM files.
                new FilterContentExtractor()
            });

            AreaRegistration.RegisterAllAreas();

            RegisterGlobalFilters(GlobalFilters.Filters);

            RegisterRoutes(RouteTable.Routes);

#if NO_AD
            CommonJobsAuthorizeAttribute.AuthorizationBehavior = new ForcedGroupsFromSettingsAuthorizationBehavior("CommonJobs/FakeADGroups");
#else
            CommonJobsAuthorizeAttribute.AuthorizationBehavior = new PrefixFromSettingsAuthorizationBehavior("CommonJobs/ADGroupsPrefix");
#endif
        }
    }
}