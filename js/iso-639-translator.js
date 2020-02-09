/**
 * Implementation to quickly translate ISO 639 language codes.
 *
 * Combination of sources
 * @link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 * @link https://www.loc.gov/standards/iso639-2/php/code_list.php
 */
const iso639 = (function () {
    'use strict';

    const codes = [
        {
            "639_1": "aa",
            "639_2_T": "aar",
            "639_2_B": "aar",
            "name": "Afar"
        },
        {
            "639_1": "ab",
            "639_2_T": "abk",
            "639_2_B": "abk",
            "name": "Abkhazian"
        },
        {
            "639_2_T": "ace",
            "name": "Achinese"
        },
        {
            "639_2_T": "ach",
            "name": "Acoli"
        },
        {
            "639_2_T": "ada",
            "name": "Adangme"
        },
        {
            "639_2_T": "ady",
            "name": "Adyghe; Adygei"
        },
        {
            "639_2_T": "afa",
            "name": "Afro-Asiatic languages"
        },
        {
            "639_2_T": "afh",
            "name": "Afrihili"
        },
        {
            "639_1": "af",
            "639_2_T": "afr",
            "639_2_B": "afr",
            "name": "Afrikaans"
        },
        {
            "639_2_T": "ain",
            "name": "Ainu"
        },
        {
            "639_1": "ak",
            "639_2_T": "aka",
            "639_2_B": "aka",
            "name": "Akan"
        },
        {
            "639_2_T": "akk",
            "name": "Akkadian"
        },
        {
            "639_2_T": "ale",
            "name": "Aleut"
        },
        {
            "639_2_T": "alg",
            "name": "Algonquian languages"
        },
        {
            "639_2_T": "alt",
            "name": "Southern Altai"
        },
        {
            "639_1": "am",
            "639_2_T": "amh",
            "639_2_B": "amh",
            "name": "Amharic"
        },
        {
            "639_2_T": "ang",
            "name": "English, Old (ca.450-1100)"
        },
        {
            "639_2_T": "anp",
            "name": "Angika"
        },
        {
            "639_2_T": "apa",
            "name": "Apache languages"
        },
        {
            "639_1": "ar",
            "639_2_T": "ara",
            "639_2_B": "ara",
            "name": "Arabic"
        },
        {
            "639_2_T": "arc",
            "name": "Official Aramaic (700-300 BCE); Imperial Aramaic (700-300 BCE)"
        },
        {
            "639_1": "an",
            "639_2_T": "arg",
            "639_2_B": "arg",
            "name": "Aragonese"
        },
        {
            "639_2_T": "arn",
            "name": "Mapudungun; Mapuche"
        },
        {
            "639_2_T": "arp",
            "name": "Arapaho"
        },
        {
            "639_2_T": "art",
            "name": "Artificial languages"
        },
        {
            "639_2_T": "arw",
            "name": "Arawak"
        },
        {
            "639_1": "as",
            "639_2_T": "asm",
            "639_2_B": "asm",
            "name": "Assamese"
        },
        {
            "639_2_T": "ast",
            "name": "Asturian; Bable; Leonese; Asturleonese"
        },
        {
            "639_2_T": "ath",
            "name": "Athapascan languages"
        },
        {
            "639_2_T": "aus",
            "name": "Australian languages"
        },
        {
            "639_1": "av",
            "639_2_T": "ava",
            "639_2_B": "ava",
            "name": "Avaric"
        },
        {
            "639_1": "ae",
            "639_2_T": "ave",
            "639_2_B": "ave",
            "name": "Avestan"
        },
        {
            "639_2_T": "awa",
            "name": "Awadhi"
        },
        {
            "639_1": "ay",
            "639_2_T": "aym",
            "639_2_B": "aym",
            "name": "Aymara"
        },
        {
            "639_1": "az",
            "639_2_T": "aze",
            "639_2_B": "aze",
            "name": "Azerbaijani"
        },
        {
            "639_2_T": "bad",
            "name": "Banda languages"
        },
        {
            "639_2_T": "bai",
            "name": "Bamileke languages"
        },
        {
            "639_1": "ba",
            "639_2_T": "bak",
            "639_2_B": "bak",
            "name": "Bashkir"
        },
        {
            "639_2_T": "bal",
            "name": "Baluchi"
        },
        {
            "639_1": "bm",
            "639_2_T": "bam",
            "639_2_B": "bam",
            "name": "Bambara"
        },
        {
            "639_2_T": "ban",
            "name": "Balinese"
        },
        {
            "639_2_T": "bas",
            "name": "Basa"
        },
        {
            "639_2_T": "bat",
            "name": "Baltic languages"
        },
        {
            "639_2_T": "bej",
            "name": "Beja; Bedawiyet"
        },
        {
            "639_1": "be",
            "639_2_T": "bel",
            "639_2_B": "bel",
            "name": "Belarusian"
        },
        {
            "639_2_T": "bem",
            "name": "Bemba"
        },
        {
            "639_1": "bn",
            "639_2_T": "ben",
            "639_2_B": "ben",
            "name": "Bengali"
        },
        {
            "639_2_T": "ber",
            "name": "Berber languages"
        },
        {
            "639_2_T": "bho",
            "name": "Bhojpuri"
        },
        {
            "639_1": "bh",
            "639_2_T": "bih",
            "639_2_B": "bih",
            "name": "Bihari languages"
        },
        {
            "639_2_T": "bik",
            "name": "Bikol"
        },
        {
            "639_2_T": "bin",
            "name": "Bini; Edo"
        },
        {
            "639_1": "bi",
            "639_2_T": "bis",
            "639_2_B": "bis",
            "name": "Bislama"
        },
        {
            "639_2_T": "bla",
            "name": "Siksika"
        },
        {
            "639_2_T": "bnt",
            "name": "Bantu languages"
        },
        {
            "639_1": "bo",
            "639_2_T": "bod",
            "639_2_B": "tib",
            "name": "Tibetan"
        },
        {
            "639_1": "bs",
            "639_2_T": "bos",
            "639_2_B": "bos",
            "name": "Bosnian"
        },
        {
            "639_2_T": "bra",
            "name": "Braj"
        },
        {
            "639_1": "br",
            "639_2_T": "bre",
            "639_2_B": "bre",
            "name": "Breton"
        },
        {
            "639_2_T": "btk",
            "name": "Batak languages"
        },
        {
            "639_2_T": "bua",
            "name": "Buriat"
        },
        {
            "639_2_T": "bug",
            "name": "Buginese"
        },
        {
            "639_1": "bg",
            "639_2_T": "bul",
            "639_2_B": "bul",
            "name": "Bulgarian"
        },
        {
            "639_2_T": "byn",
            "name": "Blin; Bilin"
        },
        {
            "639_2_T": "cad",
            "name": "Caddo"
        },
        {
            "639_2_T": "cai",
            "name": "Central American Indian languages"
        },
        {
            "639_2_T": "car",
            "name": "Galibi Carib"
        },
        {
            "639_1": "ca",
            "639_2_T": "cat",
            "639_2_B": "cat",
            "name": "Catalan, Valencian"
        },
        {
            "639_2_T": "cau",
            "name": "Caucasian languages"
        },
        {
            "639_2_T": "ceb",
            "name": "Cebuano"
        },
        {
            "639_2_T": "cel",
            "name": "Celtic languages"
        },
        {
            "639_1": "cs",
            "639_2_T": "ces",
            "639_2_B": "cze",
            "name": "Czech"
        },
        {
            "639_1": "ch",
            "639_2_T": "cha",
            "639_2_B": "cha",
            "name": "Chamorro"
        },
        {
            "639_2_T": "chb",
            "name": "Chibcha"
        },
        {
            "639_1": "ce",
            "639_2_T": "che",
            "639_2_B": "che",
            "name": "Chechen"
        },
        {
            "639_2_T": "chg",
            "name": "Chagatai"
        },
        {
            "639_2_T": "chk",
            "name": "Chuukese"
        },
        {
            "639_2_T": "chm",
            "name": "Mari"
        },
        {
            "639_2_T": "chn",
            "name": "Chinook jargon"
        },
        {
            "639_2_T": "cho",
            "name": "Choctaw"
        },
        {
            "639_2_T": "chp",
            "name": "Chipewyan; Dene Suline"
        },
        {
            "639_2_T": "chr",
            "name": "Cherokee"
        },
        {
            "639_1": "cu",
            "639_2_T": "chu",
            "639_2_B": "chu",
            "name": "Church Slavic, Old Slavonic, Church Slavonic, Old Bulgarian, Old Church Slavonic"
        },
        {
            "639_1": "cv",
            "639_2_T": "chv",
            "639_2_B": "chv",
            "name": "Chuvash"
        },
        {
            "639_2_T": "chy",
            "name": "Cheyenne"
        },
        {
            "639_2_T": "cmc",
            "name": "Chamic languages"
        },
        {
            "639_2_T": "cnr",
            "name": "Montenegrin"
        },
        {
            "639_2_T": "cop",
            "name": "Coptic"
        },
        {
            "639_1": "kw",
            "639_2_T": "cor",
            "639_2_B": "cor",
            "name": "Cornish"
        },
        {
            "639_1": "co",
            "639_2_T": "cos",
            "639_2_B": "cos",
            "name": "Corsican"
        },
        {
            "639_2_T": "cpe",
            "name": "Creoles and pidgins, English based"
        },
        {
            "639_2_T": "cpf",
            "name": "Creoles and pidgins, French-based"
        },
        {
            "639_2_T": "cpp",
            "name": "Creoles and pidgins, Portuguese-based"
        },
        {
            "639_1": "cr",
            "639_2_T": "cre",
            "639_2_B": "cre",
            "name": "Cree"
        },
        {
            "639_2_T": "crh",
            "name": "Crimean Tatar; Crimean Turkish"
        },
        {
            "639_2_T": "crp",
            "name": "Creoles and pidgins"
        },
        {
            "639_2_T": "csb",
            "name": "Kashubian"
        },
        {
            "639_2_T": "cus",
            "name": "Cushitic languages"
        },
        {
            "639_1": "cy",
            "639_2_T": "cym",
            "639_2_B": "wel",
            "name": "Welsh"
        },
        {
            "639_2_T": "dak",
            "name": "Dakota"
        },
        {
            "639_1": "da",
            "639_2_T": "dan",
            "639_2_B": "dan",
            "name": "Danish"
        },
        {
            "639_2_T": "dar",
            "name": "Dargwa"
        },
        {
            "639_2_T": "day",
            "name": "Land Dayak languages"
        },
        {
            "639_2_T": "del",
            "name": "Delaware"
        },
        {
            "639_2_T": "den",
            "name": "Slave (Athapascan)"
        },
        {
            "639_1": "de",
            "639_2_T": "deu",
            "639_2_B": "ger",
            "name": "German"
        },
        {
            "639_2_T": "dgr",
            "name": "Dogrib"
        },
        {
            "639_2_T": "din",
            "name": "Dinka"
        },
        {
            "639_1": "dv",
            "639_2_T": "div",
            "639_2_B": "div",
            "name": "Divehi, Dhivehi, Maldivian"
        },
        {
            "639_2_T": "doi",
            "name": "Dogri"
        },
        {
            "639_2_T": "dra",
            "name": "Dravidian languages"
        },
        {
            "639_2_T": "dsb",
            "name": "Lower Sorbian"
        },
        {
            "639_2_T": "dua",
            "name": "Duala"
        },
        {
            "639_2_T": "dum",
            "name": "Dutch, Middle (ca.1050-1350)"
        },
        {
            "639_2_T": "dyu",
            "name": "Dyula"
        },
        {
            "639_1": "dz",
            "639_2_T": "dzo",
            "639_2_B": "dzo",
            "name": "Dzongkha"
        },
        {
            "639_2_T": "efi",
            "name": "Efik"
        },
        {
            "639_2_T": "egy",
            "name": "Egyptian (Ancient)"
        },
        {
            "639_2_T": "eka",
            "name": "Ekajuk"
        },
        {
            "639_1": "el",
            "639_2_T": "ell",
            "639_2_B": "gre",
            "name": "Greek, Modern (1453-)"
        },
        {
            "639_2_T": "elx",
            "name": "Elamite"
        },
        {
            "639_1": "en",
            "639_2_T": "eng",
            "639_2_B": "eng",
            "name": "English"
        },
        {
            "639_2_T": "enm",
            "name": "English, Middle (1100-1500)"
        },
        {
            "639_1": "eo",
            "639_2_T": "epo",
            "639_2_B": "epo",
            "name": "Esperanto"
        },
        {
            "639_1": "et",
            "639_2_T": "est",
            "639_2_B": "est",
            "name": "Estonian"
        },
        {
            "639_1": "eu",
            "639_2_T": "eus",
            "639_2_B": "baq",
            "name": "Basque"
        },
        {
            "639_1": "ee",
            "639_2_T": "ewe",
            "639_2_B": "ewe",
            "name": "Ewe"
        },
        {
            "639_2_T": "ewo",
            "name": "Ewondo"
        },
        {
            "639_2_T": "fan",
            "name": "Fang"
        },
        {
            "639_1": "fo",
            "639_2_T": "fao",
            "639_2_B": "fao",
            "name": "Faroese"
        },
        {
            "639_1": "fa",
            "639_2_T": "fas",
            "639_2_B": "per",
            "name": "Persian"
        },
        {
            "639_2_T": "fat",
            "name": "Fanti"
        },
        {
            "639_1": "fj",
            "639_2_T": "fij",
            "639_2_B": "fij",
            "name": "Fijian"
        },
        {
            "639_2_T": "fil",
            "name": "Filipino; Pilipino"
        },
        {
            "639_1": "fi",
            "639_2_T": "fin",
            "639_2_B": "fin",
            "name": "Finnish"
        },
        {
            "639_2_T": "fiu",
            "name": "Finno-Ugrian languages"
        },
        {
            "639_2_T": "fon",
            "name": "Fon"
        },
        {
            "639_1": "fr",
            "639_2_T": "fra",
            "639_2_B": "fre",
            "name": "French"
        },
        {
            "639_2_T": "frm",
            "name": "French, Middle (ca.1400-1600)"
        },
        {
            "639_2_T": "fro",
            "name": "French, Old (842-ca.1400)"
        },
        {
            "639_2_T": "frr",
            "name": "Northern Frisian"
        },
        {
            "639_2_T": "frs",
            "name": "Eastern Frisian"
        },
        {
            "639_1": "fy",
            "639_2_T": "fry",
            "639_2_B": "fry",
            "name": "Western Frisian"
        },
        {
            "639_1": "ff",
            "639_2_T": "ful",
            "639_2_B": "ful",
            "name": "Fulah"
        },
        {
            "639_2_T": "fur",
            "name": "Friulian"
        },
        {
            "639_2_T": "gaa",
            "name": "Ga"
        },
        {
            "639_2_T": "gay",
            "name": "Gayo"
        },
        {
            "639_2_T": "gba",
            "name": "Gbaya"
        },
        {
            "639_2_T": "gem",
            "name": "Germanic languages"
        },
        {
            "639_2_T": "gez",
            "name": "Geez"
        },
        {
            "639_2_T": "gil",
            "name": "Gilbertese"
        },
        {
            "639_1": "gd",
            "639_2_T": "gla",
            "639_2_B": "gla",
            "name": "Gaelic, Scottish Gaelic"
        },
        {
            "639_1": "ga",
            "639_2_T": "gle",
            "639_2_B": "gle",
            "name": "Irish"
        },
        {
            "639_1": "gl",
            "639_2_T": "glg",
            "639_2_B": "glg",
            "name": "Galician"
        },
        {
            "639_1": "gv",
            "639_2_T": "glv",
            "639_2_B": "glv",
            "name": "Manx"
        },
        {
            "639_2_T": "gmh",
            "name": "German, Middle High (ca.1050-1500)"
        },
        {
            "639_2_T": "goh",
            "name": "German, Old High (ca.750-1050)"
        },
        {
            "639_2_T": "gon",
            "name": "Gondi"
        },
        {
            "639_2_T": "gor",
            "name": "Gorontalo"
        },
        {
            "639_2_T": "got",
            "name": "Gothic"
        },
        {
            "639_2_T": "grb",
            "name": "Grebo"
        },
        {
            "639_2_T": "grc",
            "name": "Greek, Ancient (to 1453)"
        },
        {
            "639_1": "gn",
            "639_2_T": "grn",
            "639_2_B": "grn",
            "name": "Guarani"
        },
        {
            "639_2_T": "gsw",
            "name": "Swiss German; Alemannic; Alsatian"
        },
        {
            "639_1": "gu",
            "639_2_T": "guj",
            "639_2_B": "guj",
            "name": "Gujarati"
        },
        {
            "639_2_T": "gwi",
            "name": "Gwich'in"
        },
        {
            "639_2_T": "hai",
            "name": "Haida"
        },
        {
            "639_1": "ht",
            "639_2_T": "hat",
            "639_2_B": "hat",
            "name": "Haitian, Haitian Creole"
        },
        {
            "639_1": "ha",
            "639_2_T": "hau",
            "639_2_B": "hau",
            "name": "Hausa"
        },
        {
            "639_2_T": "haw",
            "name": "Hawaiian"
        },
        {
            "639_1": "he",
            "639_2_T": "heb",
            "639_2_B": "heb",
            "name": "Hebrew"
        },
        {
            "639_1": "hz",
            "639_2_T": "her",
            "639_2_B": "her",
            "name": "Herero"
        },
        {
            "639_2_T": "hil",
            "name": "Hiligaynon"
        },
        {
            "639_2_T": "him",
            "name": "Himachali languages; Western Pahari languages"
        },
        {
            "639_1": "hi",
            "639_2_T": "hin",
            "639_2_B": "hin",
            "name": "Hindi"
        },
        {
            "639_2_T": "hit",
            "name": "Hittite"
        },
        {
            "639_2_T": "hmn",
            "name": "Hmong; Mong"
        },
        {
            "639_1": "ho",
            "639_2_T": "hmo",
            "639_2_B": "hmo",
            "name": "Hiri Motu"
        },
        {
            "639_1": "hr",
            "639_2_T": "hrv",
            "639_2_B": "hrv",
            "name": "Croatian"
        },
        {
            "639_2_T": "hsb",
            "name": "Upper Sorbian"
        },
        {
            "639_1": "hu",
            "639_2_T": "hun",
            "639_2_B": "hun",
            "name": "Hungarian"
        },
        {
            "639_2_T": "hup",
            "name": "Hupa"
        },
        {
            "639_1": "hy",
            "639_2_T": "hye",
            "639_2_B": "arm",
            "name": "Armenian"
        },
        {
            "639_2_T": "iba",
            "name": "Iban"
        },
        {
            "639_1": "ig",
            "639_2_T": "ibo",
            "639_2_B": "ibo",
            "name": "Igbo"
        },
        {
            "639_1": "io",
            "639_2_T": "ido",
            "639_2_B": "ido",
            "name": "Ido"
        },
        {
            "639_1": "ii",
            "639_2_T": "iii",
            "639_2_B": "iii",
            "name": "Sichuan Yi, Nuosu"
        },
        {
            "639_2_T": "ijo",
            "name": "Ijo languages"
        },
        {
            "639_1": "iu",
            "639_2_T": "iku",
            "639_2_B": "iku",
            "name": "Inuktitut"
        },
        {
            "639_1": "ie",
            "639_2_T": "ile",
            "639_2_B": "ile",
            "name": "Interlingue, Occidental"
        },
        {
            "639_2_T": "ilo",
            "name": "Iloko"
        },
        {
            "639_1": "ia",
            "639_2_T": "ina",
            "639_2_B": "ina",
            "name": "Interlingua (International Auxiliary Language Association)"
        },
        {
            "639_2_T": "inc",
            "name": "Indic languages"
        },
        {
            "639_1": "id",
            "639_2_T": "ind",
            "639_2_B": "ind",
            "name": "Indonesian"
        },
        {
            "639_2_T": "ine",
            "name": "Indo-European languages"
        },
        {
            "639_2_T": "inh",
            "name": "Ingush"
        },
        {
            "639_1": "ik",
            "639_2_T": "ipk",
            "639_2_B": "ipk",
            "name": "Inupiaq"
        },
        {
            "639_2_T": "ira",
            "name": "Iranian languages"
        },
        {
            "639_2_T": "iro",
            "name": "Iroquoian languages"
        },
        {
            "639_1": "is",
            "639_2_T": "isl",
            "639_2_B": "ice",
            "name": "Icelandic"
        },
        {
            "639_1": "it",
            "639_2_T": "ita",
            "639_2_B": "ita",
            "name": "Italian"
        },
        {
            "639_1": "jv",
            "639_2_T": "jav",
            "639_2_B": "jav",
            "name": "Javanese"
        },
        {
            "639_2_T": "jbo",
            "name": "Lojban"
        },
        {
            "639_1": "ja",
            "639_2_T": "jpn",
            "639_2_B": "jpn",
            "name": "Japanese"
        },
        {
            "639_2_T": "jpr",
            "name": "Judeo-Persian"
        },
        {
            "639_2_T": "jrb",
            "name": "Judeo-Arabic"
        },
        {
            "639_2_T": "kaa",
            "name": "Kara-Kalpak"
        },
        {
            "639_2_T": "kab",
            "name": "Kabyle"
        },
        {
            "639_2_T": "kac",
            "name": "Kachin; Jingpho"
        },
        {
            "639_1": "kl",
            "639_2_T": "kal",
            "639_2_B": "kal",
            "name": "Kalaallisut, Greenlandic"
        },
        {
            "639_2_T": "kam",
            "name": "Kamba"
        },
        {
            "639_1": "kn",
            "639_2_T": "kan",
            "639_2_B": "kan",
            "name": "Kannada"
        },
        {
            "639_2_T": "kar",
            "name": "Karen languages"
        },
        {
            "639_1": "ks",
            "639_2_T": "kas",
            "639_2_B": "kas",
            "name": "Kashmiri"
        },
        {
            "639_1": "ka",
            "639_2_T": "kat",
            "639_2_B": "geo",
            "name": "Georgian"
        },
        {
            "639_1": "kr",
            "639_2_T": "kau",
            "639_2_B": "kau",
            "name": "Kanuri"
        },
        {
            "639_2_T": "kaw",
            "name": "Kawi"
        },
        {
            "639_1": "kk",
            "639_2_T": "kaz",
            "639_2_B": "kaz",
            "name": "Kazakh"
        },
        {
            "639_2_T": "kbd",
            "name": "Kabardian"
        },
        {
            "639_2_T": "kha",
            "name": "Khasi"
        },
        {
            "639_2_T": "khi",
            "name": "Khoisan languages"
        },
        {
            "639_1": "km",
            "639_2_T": "khm",
            "639_2_B": "khm",
            "name": "Central Khmer"
        },
        {
            "639_2_T": "kho",
            "name": "Khotanese; Sakan"
        },
        {
            "639_1": "ki",
            "639_2_T": "kik",
            "639_2_B": "kik",
            "name": "Kikuyu, Gikuyu"
        },
        {
            "639_1": "rw",
            "639_2_T": "kin",
            "639_2_B": "kin",
            "name": "Kinyarwanda"
        },
        {
            "639_1": "ky",
            "639_2_T": "kir",
            "639_2_B": "kir",
            "name": "Kirghiz, Kyrgyz"
        },
        {
            "639_2_T": "kmb",
            "name": "Kimbundu"
        },
        {
            "639_2_T": "kok",
            "name": "Konkani"
        },
        {
            "639_1": "kv",
            "639_2_T": "kom",
            "639_2_B": "kom",
            "name": "Komi"
        },
        {
            "639_1": "kg",
            "639_2_T": "kon",
            "639_2_B": "kon",
            "name": "Kongo"
        },
        {
            "639_1": "ko",
            "639_2_T": "kor",
            "639_2_B": "kor",
            "name": "Korean"
        },
        {
            "639_2_T": "kos",
            "name": "Kosraean"
        },
        {
            "639_2_T": "kpe",
            "name": "Kpelle"
        },
        {
            "639_2_T": "krc",
            "name": "Karachay-Balkar"
        },
        {
            "639_2_T": "krl",
            "name": "Karelian"
        },
        {
            "639_2_T": "kro",
            "name": "Kru languages"
        },
        {
            "639_2_T": "kru",
            "name": "Kurukh"
        },
        {
            "639_1": "kj",
            "639_2_T": "kua",
            "639_2_B": "kua",
            "name": "Kuanyama, Kwanyama"
        },
        {
            "639_2_T": "kum",
            "name": "Kumyk"
        },
        {
            "639_1": "ku",
            "639_2_T": "kur",
            "639_2_B": "kur",
            "name": "Kurdish"
        },
        {
            "639_2_T": "kut",
            "name": "Kutenai"
        },
        {
            "639_2_T": "lad",
            "name": "Ladino"
        },
        {
            "639_2_T": "lah",
            "name": "Lahnda"
        },
        {
            "639_2_T": "lam",
            "name": "Lamba"
        },
        {
            "639_1": "lo",
            "639_2_T": "lao",
            "639_2_B": "lao",
            "name": "Lao"
        },
        {
            "639_1": "la",
            "639_2_T": "lat",
            "639_2_B": "lat",
            "name": "Latin"
        },
        {
            "639_1": "lv",
            "639_2_T": "lav",
            "639_2_B": "lav",
            "name": "Latvian"
        },
        {
            "639_2_T": "lez",
            "name": "Lezghian"
        },
        {
            "639_1": "li",
            "639_2_T": "lim",
            "639_2_B": "lim",
            "name": "Limburgan, Limburger, Limburgish"
        },
        {
            "639_1": "ln",
            "639_2_T": "lin",
            "639_2_B": "lin",
            "name": "Lingala"
        },
        {
            "639_1": "lt",
            "639_2_T": "lit",
            "639_2_B": "lit",
            "name": "Lithuanian"
        },
        {
            "639_2_T": "lol",
            "name": "Mongo"
        },
        {
            "639_2_T": "loz",
            "name": "Lozi"
        },
        {
            "639_1": "lb",
            "639_2_T": "ltz",
            "639_2_B": "ltz",
            "name": "Luxembourgish, Letzeburgesch"
        },
        {
            "639_2_T": "lua",
            "name": "Luba-Lulua"
        },
        {
            "639_1": "lu",
            "639_2_T": "lub",
            "639_2_B": "lub",
            "name": "Luba-Katanga"
        },
        {
            "639_1": "lg",
            "639_2_T": "lug",
            "639_2_B": "lug",
            "name": "Ganda"
        },
        {
            "639_2_T": "lui",
            "name": "Luiseno"
        },
        {
            "639_2_T": "lun",
            "name": "Lunda"
        },
        {
            "639_2_T": "luo",
            "name": "Luo (Kenya and Tanzania)"
        },
        {
            "639_2_T": "lus",
            "name": "Lushai"
        },
        {
            "639_2_T": "mad",
            "name": "Madurese"
        },
        {
            "639_2_T": "mag",
            "name": "Magahi"
        },
        {
            "639_1": "mh",
            "639_2_T": "mah",
            "639_2_B": "mah",
            "name": "Marshallese"
        },
        {
            "639_2_T": "mai",
            "name": "Maithili"
        },
        {
            "639_2_T": "mak",
            "name": "Makasar"
        },
        {
            "639_1": "ml",
            "639_2_T": "mal",
            "639_2_B": "mal",
            "name": "Malayalam"
        },
        {
            "639_2_T": "man",
            "name": "Mandingo"
        },
        {
            "639_2_T": "map",
            "name": "Austronesian languages"
        },
        {
            "639_1": "mr",
            "639_2_T": "mar",
            "639_2_B": "mar",
            "name": "Marathi"
        },
        {
            "639_2_T": "mas",
            "name": "Masai"
        },
        {
            "639_2_T": "mdf",
            "name": "Moksha"
        },
        {
            "639_2_T": "mdr",
            "name": "Mandar"
        },
        {
            "639_2_T": "men",
            "name": "Mende"
        },
        {
            "639_2_T": "mga",
            "name": "Irish, Middle (900-1200)"
        },
        {
            "639_2_T": "mic",
            "name": "Mi'kmaq; Micmac"
        },
        {
            "639_2_T": "min",
            "name": "Minangkabau"
        },
        {
            "639_2_T": "mis",
            "name": "Uncoded languages"
        },
        {
            "639_1": "mk",
            "639_2_T": "mkd",
            "639_2_B": "mac",
            "name": "Macedonian"
        },
        {
            "639_2_T": "mkh",
            "name": "Mon-Khmer languages"
        },
        {
            "639_1": "mg",
            "639_2_T": "mlg",
            "639_2_B": "mlg",
            "name": "Malagasy"
        },
        {
            "639_1": "mt",
            "639_2_T": "mlt",
            "639_2_B": "mlt",
            "name": "Maltese"
        },
        {
            "639_2_T": "mnc",
            "name": "Manchu"
        },
        {
            "639_2_T": "mni",
            "name": "Manipuri"
        },
        {
            "639_2_T": "mno",
            "name": "Manobo languages"
        },
        {
            "639_2_T": "moh",
            "name": "Mohawk"
        },
        {
            "639_1": "mn",
            "639_2_T": "mon",
            "639_2_B": "mon",
            "name": "Mongolian"
        },
        {
            "639_2_T": "mos",
            "name": "Mossi"
        },
        {
            "639_1": "mi",
            "639_2_T": "mri",
            "639_2_B": "mao",
            "name": "Maori"
        },
        {
            "639_1": "ms",
            "639_2_T": "msa",
            "639_2_B": "may",
            "name": "Malay"
        },
        {
            "639_2_T": "mul",
            "name": "Multiple languages"
        },
        {
            "639_2_T": "mun",
            "name": "Munda languages"
        },
        {
            "639_2_T": "mus",
            "name": "Creek"
        },
        {
            "639_2_T": "mwl",
            "name": "Mirandese"
        },
        {
            "639_2_T": "mwr",
            "name": "Marwari"
        },
        {
            "639_1": "my",
            "639_2_T": "mya",
            "639_2_B": "bur",
            "name": "Burmese"
        },
        {
            "639_2_T": "myn",
            "name": "Mayan languages"
        },
        {
            "639_2_T": "myv",
            "name": "Erzya"
        },
        {
            "639_2_T": "nah",
            "name": "Nahuatl languages"
        },
        {
            "639_2_T": "nai",
            "name": "North American Indian languages"
        },
        {
            "639_2_T": "nap",
            "name": "Neapolitan"
        },
        {
            "639_1": "na",
            "639_2_T": "nau",
            "639_2_B": "nau",
            "name": "Nauru"
        },
        {
            "639_1": "nv",
            "639_2_T": "nav",
            "639_2_B": "nav",
            "name": "Navajo, Navaho"
        },
        {
            "639_1": "nr",
            "639_2_T": "nbl",
            "639_2_B": "nbl",
            "name": "South Ndebele"
        },
        {
            "639_1": "nd",
            "639_2_T": "nde",
            "639_2_B": "nde",
            "name": "North Ndebele"
        },
        {
            "639_1": "ng",
            "639_2_T": "ndo",
            "639_2_B": "ndo",
            "name": "Ndonga"
        },
        {
            "639_2_T": "nds",
            "name": "Low German; Low Saxon; German, Low; Saxon, Low"
        },
        {
            "639_1": "ne",
            "639_2_T": "nep",
            "639_2_B": "nep",
            "name": "Nepali"
        },
        {
            "639_2_T": "new",
            "name": "Nepal Bhasa; Newari"
        },
        {
            "639_2_T": "nia",
            "name": "Nias"
        },
        {
            "639_2_T": "nic",
            "name": "Niger-Kordofanian languages"
        },
        {
            "639_2_T": "niu",
            "name": "Niuean"
        },
        {
            "639_1": "nl",
            "639_2_T": "nld",
            "639_2_B": "dut",
            "name": "Dutch, Flemish"
        },
        {
            "639_1": "nl",
            "639_2_T": "nld",
            "639_2_B": "dut",
            "name": "Dutch; Flemish"
        },
        {
            "639_1": "nn",
            "639_2_T": "nno",
            "639_2_B": "nno",
            "name": "Norwegian Nynorsk"
        },
        {
            "639_1": "nb",
            "639_2_T": "nob",
            "639_2_B": "nob",
            "name": "Norwegian Bokmål"
        },
        {
            "639_2_T": "nog",
            "name": "Nogai"
        },
        {
            "639_2_T": "non",
            "name": "Norse, Old"
        },
        {
            "639_1": "no",
            "639_2_T": "nor",
            "639_2_B": "nor",
            "name": "Norwegian"
        },
        {
            "639_2_T": "nqo",
            "name": "N'Ko"
        },
        {
            "639_2_T": "nso",
            "name": "Pedi; Sepedi; Northern Sotho"
        },
        {
            "639_2_T": "nub",
            "name": "Nubian languages"
        },
        {
            "639_2_T": "nwc",
            "name": "Classical Newari; Old Newari; Classical Nepal Bhasa"
        },
        {
            "639_1": "ny",
            "639_2_T": "nya",
            "639_2_B": "nya",
            "name": "Chichewa, Chewa, Nyanja"
        },
        {
            "639_2_T": "nym",
            "name": "Nyamwezi"
        },
        {
            "639_2_T": "nyn",
            "name": "Nyankole"
        },
        {
            "639_2_T": "nyo",
            "name": "Nyoro"
        },
        {
            "639_2_T": "nzi",
            "name": "Nzima"
        },
        {
            "639_1": "oc",
            "639_2_T": "oci",
            "639_2_B": "oci",
            "name": "Occitan"
        },
        {
            "639_1": "oj",
            "639_2_T": "oji",
            "639_2_B": "oji",
            "name": "Ojibwa"
        },
        {
            "639_1": "or",
            "639_2_T": "ori",
            "639_2_B": "ori",
            "name": "Oriya"
        },
        {
            "639_1": "om",
            "639_2_T": "orm",
            "639_2_B": "orm",
            "name": "Oromo"
        },
        {
            "639_2_T": "osa",
            "name": "Osage"
        },
        {
            "639_1": "os",
            "639_2_T": "oss",
            "639_2_B": "oss",
            "name": "Ossetian, Ossetic"
        },
        {
            "639_2_T": "ota",
            "name": "Turkish, Ottoman (1500-1928)"
        },
        {
            "639_2_T": "oto",
            "name": "Otomian languages"
        },
        {
            "639_2_T": "paa",
            "name": "Papuan languages"
        },
        {
            "639_2_T": "pag",
            "name": "Pangasinan"
        },
        {
            "639_2_T": "pal",
            "name": "Pahlavi"
        },
        {
            "639_2_T": "pam",
            "name": "Pampanga; Kapampangan"
        },
        {
            "639_1": "pa",
            "639_2_T": "pan",
            "639_2_B": "pan",
            "name": "Punjabi, Panjabi"
        },
        {
            "639_2_T": "pap",
            "name": "Papiamento"
        },
        {
            "639_2_T": "pau",
            "name": "Palauan"
        },
        {
            "639_2_T": "peo",
            "name": "Persian, Old (ca.600-400 B.C.)"
        },
        {
            "639_2_T": "phi",
            "name": "Philippine languages"
        },
        {
            "639_2_T": "phn",
            "name": "Phoenician"
        },
        {
            "639_1": "pi",
            "639_2_T": "pli",
            "639_2_B": "pli",
            "name": "Pali"
        },
        {
            "639_1": "pl",
            "639_2_T": "pol",
            "639_2_B": "pol",
            "name": "Polish"
        },
        {
            "639_2_T": "pon",
            "name": "Pohnpeian"
        },
        {
            "639_1": "pt",
            "639_2_T": "por",
            "639_2_B": "por",
            "name": "Portuguese"
        },
        {
            "639_2_T": "pra",
            "name": "Prakrit languages"
        },
        {
            "639_2_T": "pro",
            "name": "Provençal, Old (to 1500);Occitan, Old (to 1500)"
        },
        {
            "639_1": "ps",
            "639_2_T": "pus",
            "639_2_B": "pus",
            "name": "Pashto, Pushto"
        },
        {
            "639_2_T": "qaa-qtz",
            "name": "Reserved for local use"
        },
        {
            "639_1": "qu",
            "639_2_T": "que",
            "639_2_B": "que",
            "name": "Quechua"
        },
        {
            "639_2_T": "raj",
            "name": "Rajasthani"
        },
        {
            "639_2_T": "rap",
            "name": "Rapanui"
        },
        {
            "639_2_T": "rar",
            "name": "Rarotongan; Cook Islands Maori"
        },
        {
            "639_2_T": "roa",
            "name": "Romance languages"
        },
        {
            "639_1": "rm",
            "639_2_T": "roh",
            "639_2_B": "roh",
            "name": "Romansh"
        },
        {
            "639_2_T": "rom",
            "name": "Romany"
        },
        {
            "639_1": "ro",
            "639_2_T": "ron",
            "639_2_B": "rum",
            "name": "Romanian, Moldavian, Moldovan"
        },
        {
            "639_1": "ro",
            "639_2_T": "ron",
            "639_2_B": "rum",
            "name": "Romanian; Moldavian; Moldovan"
        },
        {
            "639_1": "rn",
            "639_2_T": "run",
            "639_2_B": "run",
            "name": "Rundi"
        },
        {
            "639_2_T": "rup",
            "name": "Aromanian; Arumanian; Macedo-Romanian"
        },
        {
            "639_1": "ru",
            "639_2_T": "rus",
            "639_2_B": "rus",
            "name": "Russian"
        },
        {
            "639_2_T": "sad",
            "name": "Sandawe"
        },
        {
            "639_1": "sg",
            "639_2_T": "sag",
            "639_2_B": "sag",
            "name": "Sango"
        },
        {
            "639_2_T": "sah",
            "name": "Yakut"
        },
        {
            "639_2_T": "sai",
            "name": "South American Indian languages"
        },
        {
            "639_2_T": "sal",
            "name": "Salishan languages"
        },
        {
            "639_2_T": "sam",
            "name": "Samaritan Aramaic"
        },
        {
            "639_1": "sa",
            "639_2_T": "san",
            "639_2_B": "san",
            "name": "Sanskrit"
        },
        {
            "639_2_T": "sas",
            "name": "Sasak"
        },
        {
            "639_2_T": "sat",
            "name": "Santali"
        },
        {
            "639_2_T": "scn",
            "name": "Sicilian"
        },
        {
            "639_2_T": "sco",
            "name": "Scots"
        },
        {
            "639_2_T": "sel",
            "name": "Selkup"
        },
        {
            "639_2_T": "sem",
            "name": "Semitic languages"
        },
        {
            "639_2_T": "sga",
            "name": "Irish, Old (to 900)"
        },
        {
            "639_2_T": "sgn",
            "name": "Sign Languages"
        },
        {
            "639_2_T": "shn",
            "name": "Shan"
        },
        {
            "639_2_T": "sid",
            "name": "Sidamo"
        },
        {
            "639_1": "si",
            "639_2_T": "sin",
            "639_2_B": "sin",
            "name": "Sinhala, Sinhalese"
        },
        {
            "639_2_T": "sio",
            "name": "Siouan languages"
        },
        {
            "639_2_T": "sit",
            "name": "Sino-Tibetan languages"
        },
        {
            "639_2_T": "sla",
            "name": "Slavic languages"
        },
        {
            "639_1": "sk",
            "639_2_T": "slk",
            "639_2_B": "slo",
            "name": "Slovak"
        },
        {
            "639_1": "sl",
            "639_2_T": "slv",
            "639_2_B": "slv",
            "name": "Slovenian"
        },
        {
            "639_2_T": "sma",
            "name": "Southern Sami"
        },
        {
            "639_1": "se",
            "639_2_T": "sme",
            "639_2_B": "sme",
            "name": "Northern Sami"
        },
        {
            "639_2_T": "smi",
            "name": "Sami languages"
        },
        {
            "639_2_T": "smj",
            "name": "Lule Sami"
        },
        {
            "639_2_T": "smn",
            "name": "Inari Sami"
        },
        {
            "639_1": "sm",
            "639_2_T": "smo",
            "639_2_B": "smo",
            "name": "Samoan"
        },
        {
            "639_2_T": "sms",
            "name": "Skolt Sami"
        },
        {
            "639_1": "sn",
            "639_2_T": "sna",
            "639_2_B": "sna",
            "name": "Shona"
        },
        {
            "639_1": "sd",
            "639_2_T": "snd",
            "639_2_B": "snd",
            "name": "Sindhi"
        },
        {
            "639_2_T": "snk",
            "name": "Soninke"
        },
        {
            "639_2_T": "sog",
            "name": "Sogdian"
        },
        {
            "639_1": "so",
            "639_2_T": "som",
            "639_2_B": "som",
            "name": "Somali"
        },
        {
            "639_2_T": "son",
            "name": "Songhai languages"
        },
        {
            "639_1": "st",
            "639_2_T": "sot",
            "639_2_B": "sot",
            "name": "Southern Sotho"
        },
        {
            "639_1": "es",
            "639_2_T": "spa",
            "639_2_B": "spa",
            "name": "Spanish, Castilian"
        },
        {
            "639_1": "sq",
            "639_2_T": "sqi",
            "639_2_B": "alb",
            "name": "Albanian"
        },
        {
            "639_1": "sc",
            "639_2_T": "srd",
            "639_2_B": "srd",
            "name": "Sardinian"
        },
        {
            "639_2_T": "srn",
            "name": "Sranan Tongo"
        },
        {
            "639_1": "sr",
            "639_2_T": "srp",
            "639_2_B": "srp",
            "name": "Serbian"
        },
        {
            "639_2_T": "srr",
            "name": "Serer"
        },
        {
            "639_2_T": "ssa",
            "name": "Nilo-Saharan languages"
        },
        {
            "639_1": "ss",
            "639_2_T": "ssw",
            "639_2_B": "ssw",
            "name": "Swati"
        },
        {
            "639_2_T": "suk",
            "name": "Sukuma"
        },
        {
            "639_1": "su",
            "639_2_T": "sun",
            "639_2_B": "sun",
            "name": "Sundanese"
        },
        {
            "639_2_T": "sus",
            "name": "Susu"
        },
        {
            "639_2_T": "sux",
            "name": "Sumerian"
        },
        {
            "639_1": "sw",
            "639_2_T": "swa",
            "639_2_B": "swa",
            "name": "Swahili"
        },
        {
            "639_1": "sv",
            "639_2_T": "swe",
            "639_2_B": "swe",
            "name": "Swedish"
        },
        {
            "639_2_T": "syc",
            "name": "Classical Syriac"
        },
        {
            "639_2_T": "syr",
            "name": "Syriac"
        },
        {
            "639_1": "ty",
            "639_2_T": "tah",
            "639_2_B": "tah",
            "name": "Tahitian"
        },
        {
            "639_2_T": "tai",
            "name": "Tai languages"
        },
        {
            "639_1": "ta",
            "639_2_T": "tam",
            "639_2_B": "tam",
            "name": "Tamil"
        },
        {
            "639_1": "tt",
            "639_2_T": "tat",
            "639_2_B": "tat",
            "name": "Tatar"
        },
        {
            "639_1": "te",
            "639_2_T": "tel",
            "639_2_B": "tel",
            "name": "Telugu"
        },
        {
            "639_2_T": "tem",
            "name": "Timne"
        },
        {
            "639_2_T": "ter",
            "name": "Tereno"
        },
        {
            "639_2_T": "tet",
            "name": "Tetum"
        },
        {
            "639_1": "tg",
            "639_2_T": "tgk",
            "639_2_B": "tgk",
            "name": "Tajik"
        },
        {
            "639_1": "tl",
            "639_2_T": "tgl",
            "639_2_B": "tgl",
            "name": "Tagalog"
        },
        {
            "639_1": "th",
            "639_2_T": "tha",
            "639_2_B": "tha",
            "name": "Thai"
        },
        {
            "639_2_T": "tig",
            "name": "Tigre"
        },
        {
            "639_1": "ti",
            "639_2_T": "tir",
            "639_2_B": "tir",
            "name": "Tigrinya"
        },
        {
            "639_2_T": "tiv",
            "name": "Tiv"
        },
        {
            "639_2_T": "tkl",
            "name": "Tokelau"
        },
        {
            "639_2_T": "tlh",
            "name": "Klingon; tlhIngan-Hol"
        },
        {
            "639_2_T": "tli",
            "name": "Tlingit"
        },
        {
            "639_2_T": "tmh",
            "name": "Tamashek"
        },
        {
            "639_2_T": "tog",
            "name": "Tonga (Nyasa)"
        },
        {
            "639_1": "to",
            "639_2_T": "ton",
            "639_2_B": "ton",
            "name": "Tonga (Tonga Islands)"
        },
        {
            "639_2_T": "tpi",
            "name": "Tok Pisin"
        },
        {
            "639_2_T": "tsi",
            "name": "Tsimshian"
        },
        {
            "639_1": "tn",
            "639_2_T": "tsn",
            "639_2_B": "tsn",
            "name": "Tswana"
        },
        {
            "639_1": "ts",
            "639_2_T": "tso",
            "639_2_B": "tso",
            "name": "Tsonga"
        },
        {
            "639_1": "tk",
            "639_2_T": "tuk",
            "639_2_B": "tuk",
            "name": "Turkmen"
        },
        {
            "639_2_T": "tum",
            "name": "Tumbuka"
        },
        {
            "639_2_T": "tup",
            "name": "Tupi languages"
        },
        {
            "639_1": "tr",
            "639_2_T": "tur",
            "639_2_B": "tur",
            "name": "Turkish"
        },
        {
            "639_2_T": "tut",
            "name": "Altaic languages"
        },
        {
            "639_2_T": "tvl",
            "name": "Tuvalu"
        },
        {
            "639_1": "tw",
            "639_2_T": "twi",
            "639_2_B": "twi",
            "name": "Twi"
        },
        {
            "639_2_T": "tyv",
            "name": "Tuvinian"
        },
        {
            "639_2_T": "udm",
            "name": "Udmurt"
        },
        {
            "639_2_T": "uga",
            "name": "Ugaritic"
        },
        {
            "639_1": "ug",
            "639_2_T": "uig",
            "639_2_B": "uig",
            "name": "Uighur, Uyghur"
        },
        {
            "639_1": "uk",
            "639_2_T": "ukr",
            "639_2_B": "ukr",
            "name": "Ukrainian"
        },
        {
            "639_2_T": "umb",
            "name": "Umbundu"
        },
        {
            "639_2_T": "und",
            "name": "Undetermined"
        },
        {
            "639_1": "ur",
            "639_2_T": "urd",
            "639_2_B": "urd",
            "name": "Urdu"
        },
        {
            "639_1": "uz",
            "639_2_T": "uzb",
            "639_2_B": "uzb",
            "name": "Uzbek"
        },
        {
            "639_2_T": "vai",
            "name": "Vai"
        },
        {
            "639_1": "ve",
            "639_2_T": "ven",
            "639_2_B": "ven",
            "name": "Venda"
        },
        {
            "639_1": "vi",
            "639_2_T": "vie",
            "639_2_B": "vie",
            "name": "Vietnamese"
        },
        {
            "639_1": "vo",
            "639_2_T": "vol",
            "639_2_B": "vol",
            "name": "Volapük"
        },
        {
            "639_2_T": "vot",
            "name": "Votic"
        },
        {
            "639_2_T": "wak",
            "name": "Wakashan languages"
        },
        {
            "639_2_T": "wal",
            "name": "Wolaitta; Wolaytta"
        },
        {
            "639_2_T": "war",
            "name": "Waray"
        },
        {
            "639_2_T": "was",
            "name": "Washo"
        },
        {
            "639_2_T": "wen",
            "name": "Sorbian languages"
        },
        {
            "639_1": "wa",
            "639_2_T": "wln",
            "639_2_B": "wln",
            "name": "Walloon"
        },
        {
            "639_1": "wo",
            "639_2_T": "wol",
            "639_2_B": "wol",
            "name": "Wolof"
        },
        {
            "639_2_T": "xal",
            "name": "Kalmyk; Oirat"
        },
        {
            "639_1": "xh",
            "639_2_T": "xho",
            "639_2_B": "xho",
            "name": "Xhosa"
        },
        {
            "639_2_T": "yao",
            "name": "Yao"
        },
        {
            "639_2_T": "yap",
            "name": "Yapese"
        },
        {
            "639_1": "yi",
            "639_2_T": "yid",
            "639_2_B": "yid",
            "name": "Yiddish"
        },
        {
            "639_1": "yo",
            "639_2_T": "yor",
            "639_2_B": "yor",
            "name": "Yoruba"
        },
        {
            "639_2_T": "ypk",
            "name": "Yupik languages"
        },
        {
            "639_2_T": "zap",
            "name": "Zapotec"
        },
        {
            "639_2_T": "zbl",
            "name": "Blissymbols; Blissymbolics; Bliss"
        },
        {
            "639_2_T": "zen",
            "name": "Zenaga"
        },
        {
            "639_2_T": "zgh",
            "name": "Standard Moroccan Tamazight"
        },
        {
            "639_1": "za",
            "639_2_T": "zha",
            "639_2_B": "zha",
            "name": "Zhuang, Chuang"
        },
        {
            "639_1": "zh",
            "639_2_T": "zho",
            "639_2_B": "chi",
            "name": "Chinese"
        },
        {
            "639_2_T": "znd",
            "name": "Zande languages"
        },
        {
            "639_1": "zu",
            "639_2_T": "zul",
            "639_2_B": "zul",
            "name": "Zulu"
        },
        {
            "639_2_T": "zun",
            "name": "Zuni"
        },
        {
            "639_2_T": "zxx",
            "name": "No linguistic content; Not applicable"
        },
        {
            "639_2_T": "zza",
            "name": "Zaza; Dimili; Dimli; Kirdki; Kirmanjki; Zazaki"
        }
    ];


    return {
        /**
         * @param code country code corresponding to alpha2, alpha3 or numeric3
         * @returns {name: String, 639 codes: String}
         */
        lookup: function (code) {
            if (!code) {
                return;
            }
            const codeLower = String(code).toLowerCase();
            for (let i = 0; i < codes.length; i++) {
                const codeMap = codes[i];

                if (codeLower === codeMap["639_1"] || codeLower === codeMap["639_2_T"] || codeLower === codeMap["639_2_B"]) {
                    return codeMap;
                }
            }
        }
    }
}());