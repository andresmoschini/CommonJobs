using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Raven.Client.Linq;
using CommonJobs.Raven.Infrastructure;
using CommonJobs.Domain;
using CommonJobs.ContentExtraction;
using CommonJobs.Infrastructure.Indexes;
using System.Linq.Expressions;
using CommonJobs.Utilities;

namespace CommonJobs.Infrastructure.EmployeeSearching
{
    public class SearchEmployees : Query<EmployeeSearchResult[]>
    {
        public RavenQueryStatistics Stats { get; set; }
        EmployeeSearchParameters Parameters { get; set; }

        public SearchEmployees(EmployeeSearchParameters parameters)
        {
            Parameters = parameters;
        }

        public override EmployeeSearchResult[] Execute()
        {
            
            RavenQueryStatistics stats;
            var q = RavenSession
                .Advanced.LuceneQuery<EmployeeSearchResult, Employee_QuickSearch>()
                .Statistics(out stats)
                .WaitForNonStaleResultsAsOfLastWrite()
                .Search("IsEmployee", "true")
                .AndAlso()
                .OpenSubclause();
                

            var t = Parameters.Term
                .Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(x => x.Trim('?', '*') + "*");

            var first = true;
            foreach (var t2 in t)
            {
                q = first ? q.OpenSubclause()
                    : q.AndAlso();
                first = false;
                    
                q = q.Search("Terms", t2);
            }
            if (!first)
                q = q.CloseSubclause();

            if (Parameters.SearchInNotes)
            {
                first = true;
                foreach (var t2 in t)
                {
                    q = first ? q.OrElse().OpenSubclause()
                        : q.AndAlso();
                    first = false;
                    q = q.Search("Notes", t2);
                }
                if (!first)
                    q = q.CloseSubclause();
            }

            if (Parameters.SearchInAttachments)
            {
                first = true;
                foreach (var t2 in t)
                {
                    q = first ? q.OrElse().OpenSubclause()
                        : q.AndAlso();
                    first = false;
                    q = q.Search("AttachmentContent", t2);
                }
                if (!first)
                    q = q.CloseSubclause();
            }
            q = q.CloseSubclause();

            var query = q;
            if (Parameters.Skip > 0)
                query = query.Skip(Parameters.Skip);

            if (Parameters.Take > 0)
                query = query.Take(Parameters.Take);

            var result = query.ToArray();

            if (stats.TotalResults == 0)
            {
                //var t = Parameters.Term
                //    .Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)
                //    .Select(x => x.TrimEnd('?', '*') + "*");

                //var t1 = string.Join(" ", t);

                ////|| x.Terms.StartsWith(Parameters.Term);
                //var query2 = RavenSession
                //    .Query<Employee_QuickSearch.Projection, Employee_QuickSearch>()
                //    .Search(x => x.Terms, t1)
                //    .As<Employee>();
                
                //var result2 = query2.ToArray();

                //var suggestionTerms = query2.Suggest().Suggestions;
                //var s = suggestionTerms;
            }

            Stats = stats;
            return result;
        }
    }
}
