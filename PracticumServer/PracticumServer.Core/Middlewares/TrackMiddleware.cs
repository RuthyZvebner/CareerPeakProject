﻿using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PracticumServer.Core.Middlewares
{
    public class TrackMiddleware
    {
        private readonly RequestDelegate _next;

        public TrackMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var guid = Guid.NewGuid().ToString();
            context.Items.Add("guid", guid);

            Console.WriteLine("middleware start :: " + guid);

            await _next(context);

            Console.WriteLine("middleware end :: " + guid);
        }
    }

    public static class TrackMiddlewareExtension
    {
        public static IApplicationBuilder UseTrack(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<TrackMiddleware>();
        }
    }
}