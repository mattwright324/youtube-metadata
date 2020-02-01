/**
 * Implementation to quickly translate ISO 639-1 two letter language codes.
 *
 * @link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */
const iso639 = (function () {
    'use strict';

    const codes = [
        {
            "family": "Northwest Caucasian",
            "name": "Abkhazian",
            "639_1": "ab",
            "639_2_T": "abk",
            "639_2_B": "abk",
            "639_3": "abk"
        },
        {
            "family": "Afro-Asiatic",
            "name": "Afar",
            "639_1": "aa",
            "639_2_T": "aar",
            "639_2_B": "aar",
            "639_3": "aar"
        },
        {
            "family": "Indo-European",
            "name": "Afrikaans",
            "639_1": "af",
            "639_2_T": "afr",
            "639_2_B": "afr",
            "639_3": "afr"
        },
        {
            "family": "Niger–Congo",
            "name": "Akan",
            "639_1": "ak",
            "639_2_T": "aka",
            "639_2_B": "aka",
            "639_3": "aka"
        },
        {
            "family": "Indo-European",
            "name": "Avestan",
            "639_1": "ae",
            "639_2_T": "ave",
            "639_2_B": "ave",
            "639_3": "ave"
        },
        {
            "family": "Aymaran",
            "name": "Aymara",
            "639_1": "ay",
            "639_2_T": "aym",
            "639_2_B": "aym",
            "639_3": "aym"
        },
        {
            "family": "Turkic",
            "name": "Azerbaijani",
            "639_1": "az",
            "639_2_T": "aze",
            "639_2_B": "aze",
            "639_3": "aze"
        },
        {
            "family": "Niger–Congo",
            "name": "Bambara",
            "639_1": "bm",
            "639_2_T": "bam",
            "639_2_B": "bam",
            "639_3": "bam"
        },
        {
            "family": "Turkic",
            "name": "Bashkir",
            "639_1": "ba",
            "639_2_T": "bak",
            "639_2_B": "bak",
            "639_3": "bak"
        },
        {
            "family": "Language isolate",
            "name": "Basque",
            "639_1": "eu",
            "639_2_T": "eus",
            "639_2_B": "baq",
            "639_3": "eus"
        },
        {
            "family": "Indo-European",
            "name": "Belarusian",
            "639_1": "be",
            "639_2_T": "bel",
            "639_2_B": "bel",
            "639_3": "bel"
        },
        {
            "family": "Indo-European",
            "name": "Bengali",
            "639_1": "bn",
            "639_2_T": "ben",
            "639_2_B": "ben",
            "639_3": "ben"
        },
        {
            "family": "Indo-European",
            "name": "Bihari languages",
            "639_1": "bh",
            "639_2_T": "bih",
            "639_2_B": "bih",
            "639_3": ""
        },
        {
            "family": "Austronesian",
            "name": "Chamorro",
            "639_1": "ch",
            "639_2_T": "cha",
            "639_2_B": "cha",
            "639_3": "cha"
        },
        {
            "family": "Northeast Caucasian",
            "name": "Chechen",
            "639_1": "ce",
            "639_2_T": "che",
            "639_2_B": "che",
            "639_3": "che"
        },
        {
            "family": "Niger–Congo",
            "name": "Chichewa, Chewa, Nyanja",
            "639_1": "ny",
            "639_2_T": "nya",
            "639_2_B": "nya",
            "639_3": "nya"
        },
        {
            "family": "Sino-Tibetan",
            "name": "Chinese",
            "639_1": "zh",
            "639_2_T": "zho",
            "639_2_B": "chi",
            "639_3": "zho"
        },
        {
            "family": "Turkic",
            "name": "Chuvash",
            "639_1": "cv",
            "639_2_T": "chv",
            "639_2_B": "chv",
            "639_3": "chv"
        },
        {
            "family": "Indo-European",
            "name": "Cornish",
            "639_1": "kw",
            "639_2_T": "cor",
            "639_2_B": "cor",
            "639_3": "cor"
        },
        {
            "family": "Indo-European",
            "name": "Corsican",
            "639_1": "co",
            "639_2_T": "cos",
            "639_2_B": "cos",
            "639_3": "cos"
        },
        {
            "family": "Algonquian",
            "name": "Cree",
            "639_1": "cr",
            "639_2_T": "cre",
            "639_2_B": "cre",
            "639_3": "cre"
        },
        {
            "family": "Indo-European",
            "name": "Croatian",
            "639_1": "hr",
            "639_2_T": "hrv",
            "639_2_B": "hrv",
            "639_3": "hrv"
        },
        {
            "family": "Indo-European",
            "name": "Czech",
            "639_1": "cs",
            "639_2_T": "ces",
            "639_2_B": "cze",
            "639_3": "ces"
        },
        {
            "family": "Indo-European",
            "name": "Danish",
            "639_1": "da",
            "639_2_T": "dan",
            "639_2_B": "dan",
            "639_3": "dan"
        },
        {
            "family": "Indo-European",
            "name": "Divehi, Dhivehi, Maldivian",
            "639_1": "dv",
            "639_2_T": "div",
            "639_2_B": "div",
            "639_3": "div"
        },
        {
            "family": "Indo-European",
            "name": "Dutch, Flemish",
            "639_1": "nl",
            "639_2_T": "nld",
            "639_2_B": "dut",
            "639_3": "nld"
        },
        {
            "family": "Sino-Tibetan",
            "name": "Dzongkha",
            "639_1": "dz",
            "639_2_T": "dzo",
            "639_2_B": "dzo",
            "639_3": "dzo"
        },
        {
            "family": "Indo-European",
            "name": "English",
            "639_1": "en",
            "639_2_T": "eng",
            "639_2_B": "eng",
            "639_3": "eng"
        },
        {
            "family": "Constructed",
            "name": "Esperanto",
            "639_1": "eo",
            "639_2_T": "epo",
            "639_2_B": "epo",
            "639_3": "epo"
        },
        {
            "family": "Niger–Congo",
            "name": "Ewe",
            "639_1": "ee",
            "639_2_T": "ewe",
            "639_2_B": "ewe",
            "639_3": "ewe"
        },
        {
            "family": "Indo-European",
            "name": "Faroese",
            "639_1": "fo",
            "639_2_T": "fao",
            "639_2_B": "fao",
            "639_3": "fao"
        },
        {
            "family": "Austronesian",
            "name": "Fijian",
            "639_1": "fj",
            "639_2_T": "fij",
            "639_2_B": "fij",
            "639_3": "fij"
        },
        {
            "family": "Uralic",
            "name": "Finnish",
            "639_1": "fi",
            "639_2_T": "fin",
            "639_2_B": "fin",
            "639_3": "fin"
        },
        {
            "family": "Indo-European",
            "name": "French",
            "639_1": "fr",
            "639_2_T": "fra",
            "639_2_B": "fre",
            "639_3": "fra"
        },
        {
            "family": "Niger–Congo",
            "name": "Fulah",
            "639_1": "ff",
            "639_2_T": "ful",
            "639_2_B": "ful",
            "639_3": "ful"
        },
        {
            "family": "Tupian",
            "name": "Guarani",
            "639_1": "gn",
            "639_2_T": "grn",
            "639_2_B": "grn",
            "639_3": "grn"
        },
        {
            "family": "Indo-European",
            "name": "Gujarati",
            "639_1": "gu",
            "639_2_T": "guj",
            "639_2_B": "guj",
            "639_3": "guj"
        },
        {
            "family": "Creole",
            "name": "Haitian, Haitian Creole",
            "639_1": "ht",
            "639_2_T": "hat",
            "639_2_B": "hat",
            "639_3": "hat"
        },
        {
            "family": "Afro-Asiatic",
            "name": "Hausa",
            "639_1": "ha",
            "639_2_T": "hau",
            "639_2_B": "hau",
            "639_3": "hau"
        },
        {
            "family": "Afro-Asiatic",
            "name": "Hebrew",
            "639_1": "he",
            "639_2_T": "heb",
            "639_2_B": "heb",
            "639_3": "heb"
        },
        {
            "family": "Austronesian",
            "name": "Hiri Motu",
            "639_1": "ho",
            "639_2_T": "hmo",
            "639_2_B": "hmo",
            "639_3": "hmo"
        },
        {
            "family": "Uralic",
            "name": "Hungarian",
            "639_1": "hu",
            "639_2_T": "hun",
            "639_2_B": "hun",
            "639_3": "hun"
        },
        {
            "family": "Constructed",
            "name": "Interlingua",
            "639_1": "ia",
            "639_2_T": "ina",
            "639_2_B": "ina",
            "639_3": "ina"
        },
        {
            "family": "Austronesian",
            "name": "Indonesian",
            "639_1": "id",
            "639_2_T": "ind",
            "639_2_B": "ind",
            "639_3": "ind"
        },
        {
            "family": "Constructed",
            "name": "Ido",
            "639_1": "io",
            "639_2_T": "ido",
            "639_2_B": "ido",
            "639_3": "ido"
        },
        {
            "family": "Eskimo–Aleut",
            "name": "Kalaallisut, Greenlandic",
            "639_1": "kl",
            "639_2_T": "kal",
            "639_2_B": "kal",
            "639_3": "kal"
        },
        {
            "family": "Dravidian",
            "name": "Kannada",
            "639_1": "kn",
            "639_2_T": "kan",
            "639_2_B": "kan",
            "639_3": "kan"
        },
        {
            "family": "Nilo-Saharan",
            "name": "Kanuri",
            "639_1": "kr",
            "639_2_T": "kau",
            "639_2_B": "kau",
            "639_3": "kau"
        },
        {
            "family": "Indo-European",
            "name": "Kashmiri",
            "639_1": "ks",
            "639_2_T": "kas",
            "639_2_B": "kas",
            "639_3": "kas"
        },
        {
            "family": "Turkic",
            "name": "Kazakh",
            "639_1": "kk",
            "639_2_T": "kaz",
            "639_2_B": "kaz",
            "639_3": "kaz"
        },
        {
            "family": "Austroasiatic",
            "name": "Central Khmer",
            "639_1": "km",
            "639_2_T": "khm",
            "639_2_B": "khm",
            "639_3": "khm"
        },
        {
            "family": "Niger–Congo",
            "name": "Kikuyu, Gikuyu",
            "639_1": "ki",
            "639_2_T": "kik",
            "639_2_B": "kik",
            "639_3": "kik"
        },
        {
            "family": "Niger–Congo",
            "name": "Kinyarwanda",
            "639_1": "rw",
            "639_2_T": "kin",
            "639_2_B": "kin",
            "639_3": "kin"
        },
        {
            "family": "Turkic",
            "name": "Kirghiz, Kyrgyz",
            "639_1": "ky",
            "639_2_T": "kir",
            "639_2_B": "kir",
            "639_3": "kir"
        },
        {
            "family": "Uralic",
            "name": "Komi",
            "639_1": "kv",
            "639_2_T": "kom",
            "639_2_B": "kom",
            "639_3": "kom"
        },
        {
            "family": "Niger–Congo",
            "name": "Kongo",
            "639_1": "kg",
            "639_2_T": "kon",
            "639_2_B": "kon",
            "639_3": "kon"
        },
        {
            "family": "Koreanic",
            "name": "Korean",
            "639_1": "ko",
            "639_2_T": "kor",
            "639_2_B": "kor",
            "639_3": "kor"
        },
        {
            "family": "Indo-European",
            "name": "Kurdish",
            "639_1": "ku",
            "639_2_T": "kur",
            "639_2_B": "kur",
            "639_3": "kur"
        },
        {
            "family": "Niger–Congo",
            "name": "Kuanyama, Kwanyama",
            "639_1": "kj",
            "639_2_T": "kua",
            "639_2_B": "kua",
            "639_3": "kua"
        },
        {
            "family": "Indo-European",
            "name": "Latin",
            "639_1": "la",
            "639_2_T": "lat",
            "639_2_B": "lat",
            "639_3": "lat"
        },
        {
            "family": "Indo-European",
            "name": "Luxembourgish, Letzeburgesch",
            "639_1": "lb",
            "639_2_T": "ltz",
            "639_2_B": "ltz",
            "639_3": "ltz"
        },
        {
            "family": "Niger–Congo",
            "name": "Ganda",
            "639_1": "lg",
            "639_2_T": "lug",
            "639_2_B": "lug",
            "639_3": "lug"
        },
        {
            "family": "Indo-European",
            "name": "Limburgan, Limburger, Limburgish",
            "639_1": "li",
            "639_2_T": "lim",
            "639_2_B": "lim",
            "639_3": "lim"
        },
        {
            "family": "Niger–Congo",
            "name": "Lingala",
            "639_1": "ln",
            "639_2_T": "lin",
            "639_2_B": "lin",
            "639_3": "lin"
        },
        {
            "family": "Tai–Kadai",
            "name": "Lao",
            "639_1": "lo",
            "639_2_T": "lao",
            "639_2_B": "lao",
            "639_3": "lao"
        },
        {
            "family": "Indo-European",
            "name": "Lithuanian",
            "639_1": "lt",
            "639_2_T": "lit",
            "639_2_B": "lit",
            "639_3": "lit"
        },
        {
            "family": "Niger–Congo",
            "name": "Luba-Katanga",
            "639_1": "lu",
            "639_2_T": "lub",
            "639_2_B": "lub",
            "639_3": "lub"
        },
        {
            "family": "Indo-European",
            "name": "Latvian",
            "639_1": "lv",
            "639_2_T": "lav",
            "639_2_B": "lav",
            "639_3": "lav"
        },
        {
            "family": "Indo-European",
            "name": "Manx",
            "639_1": "gv",
            "639_2_T": "glv",
            "639_2_B": "glv",
            "639_3": "glv"
        },
        {
            "family": "Indo-European",
            "name": "Macedonian",
            "639_1": "mk",
            "639_2_T": "mkd",
            "639_2_B": "mac",
            "639_3": "mkd"
        },
        {
            "family": "Austronesian",
            "name": "Malagasy",
            "639_1": "mg",
            "639_2_T": "mlg",
            "639_2_B": "mlg",
            "639_3": "mlg"
        },
        {
            "family": "Austronesian",
            "name": "Malay",
            "639_1": "ms",
            "639_2_T": "msa",
            "639_2_B": "may",
            "639_3": "msa"
        },
        {
            "family": "Niger–Congo",
            "name": "North Ndebele",
            "639_1": "nd",
            "639_2_T": "nde",
            "639_2_B": "nde",
            "639_3": "nde"
        },
        {
            "family": "Indo-European",
            "name": "Nepali",
            "639_1": "ne",
            "639_2_T": "nep",
            "639_2_B": "nep",
            "639_3": "nep"
        },
        {
            "family": "Niger–Congo",
            "name": "Ndonga",
            "639_1": "ng",
            "639_2_T": "ndo",
            "639_2_B": "ndo",
            "639_3": "ndo"
        },
        {
            "family": "Indo-European",
            "name": "Norwegian Bokmål",
            "639_1": "nb",
            "639_2_T": "nob",
            "639_2_B": "nob",
            "639_3": "nob"
        },
        {
            "family": "Indo-European",
            "name": "Norwegian Nynorsk",
            "639_1": "nn",
            "639_2_T": "nno",
            "639_2_B": "nno",
            "639_3": "nno"
        },
        {
            "family": "Indo-European",
            "name": "Norwegian",
            "639_1": "no",
            "639_2_T": "nor",
            "639_2_B": "nor",
            "639_3": "nor"
        },
        {
            "family": "Niger–Congo",
            "name": "South Ndebele",
            "639_1": "nr",
            "639_2_T": "nbl",
            "639_2_B": "nbl",
            "639_3": "nbl"
        },
        {
            "family": "Indo-European",
            "name": "Occitan",
            "639_1": "oc",
            "639_2_T": "oci",
            "639_2_B": "oci",
            "639_3": "oci"
        },
        {
            "family": "Algonquian",
            "name": "Ojibwa",
            "639_1": "oj",
            "639_2_T": "oji",
            "639_2_B": "oji",
            "639_3": "oji"
        },
        {
            "family": "Indo-European",
            "name": "Punjabi, Panjabi",
            "639_1": "pa",
            "639_2_T": "pan",
            "639_2_B": "pan",
            "639_3": "pan"
        },
        {
            "family": "Indo-European",
            "name": "Pali",
            "639_1": "pi",
            "639_2_T": "pli",
            "639_2_B": "pli",
            "639_3": "pli"
        },
        {
            "family": "Indo-European",
            "name": "Pashto, Pushto",
            "639_1": "ps",
            "639_2_T": "pus",
            "639_2_B": "pus",
            "639_3": "pus"
        },
        {
            "family": "Indo-European",
            "name": "Portuguese",
            "639_1": "pt",
            "639_2_T": "por",
            "639_2_B": "por",
            "639_3": "por"
        },
        {
            "family": "Quechuan",
            "name": "Quechua",
            "639_1": "qu",
            "639_2_T": "que",
            "639_2_B": "que",
            "639_3": "que"
        },
        {
            "family": "Indo-European",
            "name": "Romansh",
            "639_1": "rm",
            "639_2_T": "roh",
            "639_2_B": "roh",
            "639_3": "roh"
        },
        {
            "family": "Niger–Congo",
            "name": "Rundi",
            "639_1": "rn",
            "639_2_T": "run",
            "639_2_B": "run",
            "639_3": "run"
        },
        {
            "family": "Indo-European",
            "name": "Romanian, Moldavian, Moldovan",
            "639_1": "ro",
            "639_2_T": "ron",
            "639_2_B": "rum",
            "639_3": "ron"
        },
        {
            "family": "Uralic",
            "name": "Northern Sami",
            "639_1": "se",
            "639_2_T": "sme",
            "639_2_B": "sme",
            "639_3": "sme"
        },
        {
            "family": "Austronesian",
            "name": "Samoan",
            "639_1": "sm",
            "639_2_T": "smo",
            "639_2_B": "smo",
            "639_3": "smo"
        },
        {
            "family": "Creole",
            "name": "Sango",
            "639_1": "sg",
            "639_2_T": "sag",
            "639_2_B": "sag",
            "639_3": "sag"
        },
        {
            "family": "Indo-European",
            "name": "Serbian",
            "639_1": "sr",
            "639_2_T": "srp",
            "639_2_B": "srp",
            "639_3": "srp"
        },
        {
            "family": "Indo-European",
            "name": "Gaelic, Scottish Gaelic",
            "639_1": "gd",
            "639_2_T": "gla",
            "639_2_B": "gla",
            "639_3": "gla"
        },
        {
            "family": "Niger–Congo",
            "name": "Shona",
            "639_1": "sn",
            "639_2_T": "sna",
            "639_2_B": "sna",
            "639_3": "sna"
        },
        {
            "family": "Indo-European",
            "name": "Sinhala, Sinhalese",
            "639_1": "si",
            "639_2_T": "sin",
            "639_2_B": "sin",
            "639_3": "sin"
        },
        {
            "family": "Indo-European",
            "name": "Slovak",
            "639_1": "sk",
            "639_2_T": "slk",
            "639_2_B": "slo",
            "639_3": "slk"
        },
        {
            "family": "Indo-European",
            "name": "Slovenian",
            "639_1": "sl",
            "639_2_T": "slv",
            "639_2_B": "slv",
            "639_3": "slv"
        },
        {
            "family": "Afro-Asiatic",
            "name": "Somali",
            "639_1": "so",
            "639_2_T": "som",
            "639_2_B": "som",
            "639_3": "som"
        },
        {
            "family": "Niger–Congo",
            "name": "Southern Sotho",
            "639_1": "st",
            "639_2_T": "sot",
            "639_2_B": "sot",
            "639_3": "sot"
        },
        {
            "family": "Indo-European",
            "name": "Spanish, Castilian",
            "639_1": "es",
            "639_2_T": "spa",
            "639_2_B": "spa",
            "639_3": "spa"
        },
        {
            "family": "Austronesian",
            "name": "Sundanese",
            "639_1": "su",
            "639_2_T": "sun",
            "639_2_B": "sun",
            "639_3": "sun"
        },
        {
            "family": "Niger–Congo",
            "name": "Swahili",
            "639_1": "sw",
            "639_2_T": "swa",
            "639_2_B": "swa",
            "639_3": "swa"
        },
        {
            "family": "Niger–Congo",
            "name": "Swati",
            "639_1": "ss",
            "639_2_T": "ssw",
            "639_2_B": "ssw",
            "639_3": "ssw"
        },
        {
            "family": "Indo-European",
            "name": "Swedish",
            "639_1": "sv",
            "639_2_T": "swe",
            "639_2_B": "swe",
            "639_3": "swe"
        },
        {
            "family": "Dravidian",
            "name": "Tamil",
            "639_1": "ta",
            "639_2_T": "tam",
            "639_2_B": "tam",
            "639_3": "tam"
        },
        {
            "family": "Dravidian",
            "name": "Telugu",
            "639_1": "te",
            "639_2_T": "tel",
            "639_2_B": "tel",
            "639_3": "tel"
        },
        {
            "family": "Indo-European",
            "name": "Tajik",
            "639_1": "tg",
            "639_2_T": "tgk",
            "639_2_B": "tgk",
            "639_3": "tgk"
        },
        {
            "family": "Tai–Kadai",
            "name": "Thai",
            "639_1": "th",
            "639_2_T": "tha",
            "639_2_B": "tha",
            "639_3": "tha"
        },
        {
            "family": "Afro-Asiatic",
            "name": "Tigrinya",
            "639_1": "ti",
            "639_2_T": "tir",
            "639_2_B": "tir",
            "639_3": "tir"
        },
        {
            "family": "Sino-Tibetan",
            "name": "Tibetan",
            "639_1": "bo",
            "639_2_T": "bod",
            "639_2_B": "tib",
            "639_3": "bod"
        },
        {
            "family": "Turkic",
            "name": "Turkmen",
            "639_1": "tk",
            "639_2_T": "tuk",
            "639_2_B": "tuk",
            "639_3": "tuk"
        },
        {
            "family": "Austronesian",
            "name": "Tagalog",
            "639_1": "tl",
            "639_2_T": "tgl",
            "639_2_B": "tgl",
            "639_3": "tgl"
        },
        {
            "family": "Niger–Congo",
            "name": "Tswana",
            "639_1": "tn",
            "639_2_T": "tsn",
            "639_2_B": "tsn",
            "639_3": "tsn"
        },
        {
            "family": "Austronesian",
            "name": "Tonga (Tonga Islands)",
            "639_1": "to",
            "639_2_T": "ton",
            "639_2_B": "ton",
            "639_3": "ton"
        },
        {
            "family": "Turkic",
            "name": "Turkish",
            "639_1": "tr",
            "639_2_T": "tur",
            "639_2_B": "tur",
            "639_3": "tur"
        },
        {
            "family": "Niger–Congo",
            "name": "Tsonga",
            "639_1": "ts",
            "639_2_T": "tso",
            "639_2_B": "tso",
            "639_3": "tso"
        },
        {
            "family": "Turkic",
            "name": "Tatar",
            "639_1": "tt",
            "639_2_T": "tat",
            "639_2_B": "tat",
            "639_3": "tat"
        },
        {
            "family": "Niger–Congo",
            "name": "Twi",
            "639_1": "tw",
            "639_2_T": "twi",
            "639_2_B": "twi",
            "639_3": "twi"
        },
        {
            "family": "Austronesian",
            "name": "Tahitian",
            "639_1": "ty",
            "639_2_T": "tah",
            "639_2_B": "tah",
            "639_3": "tah"
        },
        {
            "family": "Turkic",
            "name": "Uighur, Uyghur",
            "639_1": "ug",
            "639_2_T": "uig",
            "639_2_B": "uig",
            "639_3": "uig"
        },
        {
            "family": "Indo-European",
            "name": "Ukrainian",
            "639_1": "uk",
            "639_2_T": "ukr",
            "639_2_B": "ukr",
            "639_3": "ukr"
        },
        {
            "family": "Indo-European",
            "name": "Urdu",
            "639_1": "ur",
            "639_2_T": "urd",
            "639_2_B": "urd",
            "639_3": "urd"
        },
        {
            "family": "Turkic",
            "name": "Uzbek",
            "639_1": "uz",
            "639_2_T": "uzb",
            "639_2_B": "uzb",
            "639_3": "uzb"
        },
        {
            "family": "Niger–Congo",
            "name": "Venda",
            "639_1": "ve",
            "639_2_T": "ven",
            "639_2_B": "ven",
            "639_3": "ven"
        },
        {
            "family": "Austroasiatic",
            "name": "Vietnamese",
            "639_1": "vi",
            "639_2_T": "vie",
            "639_2_B": "vie",
            "639_3": "vie"
        },
        {
            "family": "Constructed",
            "name": "Volapük",
            "639_1": "vo",
            "639_2_T": "vol",
            "639_2_B": "vol",
            "639_3": "vol"
        },
        {
            "family": "Indo-European",
            "name": "Walloon",
            "639_1": "wa",
            "639_2_T": "wln",
            "639_2_B": "wln",
            "639_3": "wln"
        },
        {
            "family": "Indo-European",
            "name": "Welsh",
            "639_1": "cy",
            "639_2_T": "cym",
            "639_2_B": "wel",
            "639_3": "cym"
        },
        {
            "family": "Niger–Congo",
            "name": "Wolof",
            "639_1": "wo",
            "639_2_T": "wol",
            "639_2_B": "wol",
            "639_3": "wol"
        },
        {
            "family": "Indo-European",
            "name": "Western Frisian",
            "639_1": "fy",
            "639_2_T": "fry",
            "639_2_B": "fry",
            "639_3": "fry"
        },
        {
            "family": "Niger–Congo",
            "name": "Xhosa",
            "639_1": "xh",
            "639_2_T": "xho",
            "639_2_B": "xho",
            "639_3": "xho"
        },
        {
            "family": "Indo-European",
            "name": "Yiddish",
            "639_1": "yi",
            "639_2_T": "yid",
            "639_2_B": "yid",
            "639_3": "yid"
        },
        {
            "family": "Niger–Congo",
            "name": "Zulu",
            "639_1": "zu",
            "639_2_T": "zul",
            "639_2_B": "zul",
            "639_3": "zul"
        }
    ];


    return {
        /**
         * @param code country code corresponding to alpha2, alpha3 or numeric3
         * @returns {family: String, name: String, 639 codes: String}
         */
        lookup: function (code) {
            if (!code) {
                return;
            }
            const codeLower = String(code).toLowerCase();
            for (let i=0; i<codes.length; i++) {
                const codeMap = codes[i];

                if (codeLower === codeMap["639_1"] || codeLower === codeMap["639_2_T"] || codeLower === codeMap["639_2_B"] || codeLower === codeMap["639_3"]) {
                    return codeMap;
                }
            }
        }
    }
}());