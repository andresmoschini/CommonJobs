using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CommonJobs.Raven.Mvc;

namespace CommonJobs.Mvc.UI.Controllers
{
    public class AngularAppController : CommonJobsController
    {
        //
        // GET: /app/

        public ActionResult Index()
        {
            return View();
        }

    }
}
