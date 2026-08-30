/**
 * Delhi News Live — Environment Variables Provider
 * In a static browser setup, this provides access to environment variables
 * matching the project's .env configuration.
 */
(function () {
    'use strict';

    window.ENV = window.ENV || {};

    // Load configuration from window.__ENV__ or default env definitions
    window.ENV.VITE_SUPABASE_URL = window.ENV.VITE_SUPABASE_URL || "https://vsghhtrozahyxdzzxmkh.supabase.co";
    window.ENV.VITE_SUPABASE_PUBLISHABLE_KEY = window.ENV.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_IhQkavOCGiFAFeWcnEyTkQ_AYwPmGXp";
})();
