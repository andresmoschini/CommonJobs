using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CommonJobs.Domain;
using CommonJobs.Infrastructure;
using CommonJobs.Infrastructure.Vacations;
using CommonJobs.Raven.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NLog;
using Raven.Abstractions.Linq;
using Raven.Json.Linq;

namespace CommonJobs.Mvc.UI.Controllers
{
    public class MyJobController : CommonJobsController
    {
        private static Logger log = LogManager.GetCurrentClassLogger();

        public ActionResult Index()
        {
            return View();
        }

        private dynamic MyJobResult(string id)
        {
            var documentId = GetMyJobDocumentId(id);

            //It is to make only one request
            RavenSession.Load<dynamic>(id, documentId);

            //TODO: create a view model and a mapping
            var employee = RavenSession.Load<Employee>(id);
            var readOnlyData = new { employee.FirstName, employee.LastName };

            var document = RavenSession.Load<dynamic>(documentId);

            return new { employee = readOnlyData, document = document };
        }

        /// <param name="id">Employee id</param>
        public ActionResult Get(string id)
        {
            //TODO: check if id is allowed for current user
            return Json(MyJobResult(id));
        }

        /// <param name="id">EmployeeId Document id, for example employees/243/myjob</param>
        [HttpPost]
        public ActionResult Post(string id, string dynamic)
        {
            //TODO: check if id is allowed for current user
            var documentId = GetMyJobDocumentId(id);

            //TODO: document is a string to avoid issues on binding parameters, it could be fixed in a future
            dynamic document = JsonConvert.DeserializeObject(dynamic, new JsonSerializerSettings() { TypeNameHandling = TypeNameHandling.Auto });

            RavenSession.Store(document, documentId);

            return Json(MyJobResult(id));
        }

        private static string GetMyJobDocumentId(string id)
        {
            var documentId = id + "/myjob";
            return documentId;
        }
    }
}
