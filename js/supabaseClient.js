/**
 * Delhi News Live — Supabase Client Initializer
 * Creates and exports the Supabase client using environment variables.
 */
(function () {
    'use strict';

    // Retrieve credentials from environment variables
    const env = window.ENV || (typeof process !== 'undefined' && process.env ? process.env : {});
    const supabaseUrl = env.VITE_SUPABASE_URL || '';
    const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
        console.warn('⚠️ Supabase credentials missing from environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY).');
        window.supabaseClient = null;
        return;
    }

    if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
        console.error('❌ Supabase JS SDK not loaded. Please include the Supabase CDN script before supabaseClient.js.');
        window.supabaseClient = null;
        return;
    }

    try {
        window.supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        });
        console.log('✅ Supabase Client initialized successfully.');
    } catch (err) {
        console.error('❌ Failed to initialize Supabase client:', err);
        window.supabaseClient = null;
    }
})();
