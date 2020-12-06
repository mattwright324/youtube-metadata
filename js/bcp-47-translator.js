/**
 * BCP 47 is a combination of country code ISO 3166 and language code ISO 639.
 *
 * This translates both codes.
 */
const bcp47 = (function (iso3166, iso639) {
    'use strict';

    return {
        lookup: function(code) {
            if (!code) {
                return;
            }

            const parts = String(code).split(/[-|_]/);
            return {
                language: iso639.lookup(parts[0]) || iso639.lookup(parts[1]),
                country: iso3166.lookup(parts[0]) || iso3166.lookup(parts[1])
            }
        }
    }
}(iso3166, iso639));
