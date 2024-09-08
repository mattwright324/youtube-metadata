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

/**
 * Implementation to quickly translate ISO 3166-1 two and three letter and digit country codes.
 *
 * @link https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
 */
const iso3166 = (function () {
    'use strict';

    const codes = [
        {
            "name": "Afghanistan",
            "numeric3": "004",
            "alpha2": "AF"
        },
        {
            "name": "Åland Islands",
            "numeric3": "248",
            "alpha2": "AX"
        },
        {
            "name": "Albania",
            "numeric3": "008",
            "alpha2": "AL"
        },
        {
            "name": "Algeria",
            "numeric3": "012",
            "alpha2": "DZ"
        },
        {
            "name": "American Samoa",
            "numeric3": "016",
            "alpha2": "AS"
        },
        {
            "name": "Andorra",
            "numeric3": "020",
            "alpha2": "AD"
        },
        {
            "name": "Angola",
            "numeric3": "024",
            "alpha2": "AO"
        },
        {
            "name": "Anguilla",
            "numeric3": "660",
            "alpha2": "AI"
        },
        {
            "name": "Antarctica",
            "numeric3": "010",
            "alpha2": "AQ"
        },
        {
            "name": "Antigua and Barbuda",
            "numeric3": "028",
            "alpha2": "AG"
        },
        {
            "name": "Argentina",
            "numeric3": "032",
            "alpha2": "AR"
        },
        {
            "name": "Armenia",
            "numeric3": "051",
            "alpha2": "AM"
        },
        {
            "name": "Aruba",
            "numeric3": "533",
            "alpha2": "AW"
        },
        {
            "name": "Australia",
            "numeric3": "036",
            "alpha2": "AU"
        },
        {
            "name": "Austria",
            "numeric3": "040",
            "alpha2": "AT"
        },
        {
            "name": "Azerbaijan",
            "numeric3": "031",
            "alpha2": "AZ"
        },
        {
            "name": "Bahamas (the)",
            "numeric3": "044",
            "alpha2": "BS"
        },
        {
            "name": "Bahrain",
            "numeric3": "048",
            "alpha2": "BH"
        },
        {
            "name": "Bangladesh",
            "numeric3": "050",
            "alpha2": "BD"
        },
        {
            "name": "Barbados",
            "numeric3": "052",
            "alpha2": "BB"
        },
        {
            "name": "Belarus",
            "numeric3": "112",
            "alpha2": "BY"
        },
        {
            "name": "Belgium",
            "numeric3": "056",
            "alpha2": "BE"
        },
        {
            "name": "Belize",
            "numeric3": "084",
            "alpha2": "BZ"
        },
        {
            "name": "Benin",
            "numeric3": "204",
            "alpha2": "BJ"
        },
        {
            "name": "Bermuda",
            "numeric3": "060",
            "alpha2": "BM"
        },
        {
            "name": "Bhutan",
            "numeric3": "064",
            "alpha2": "BT"
        },
        {
            "name": "Bolivia (Plurinational State of)",
            "numeric3": "068",
            "alpha2": "BO"
        },
        {
            "name": "Bonaire Sint Eustatius Saba",
            "numeric3": "535",
            "alpha2": "BQ"
        },
        {
            "name": "Bosnia and Herzegovina",
            "numeric3": "070",
            "alpha2": "BA"
        },
        {
            "name": "Botswana",
            "numeric3": "072",
            "alpha2": "BW"
        },
        {
            "name": "Bouvet Island",
            "numeric3": "074",
            "alpha2": "BV"
        },
        {
            "name": "Brazil",
            "numeric3": "076",
            "alpha2": "BR"
        },
        {
            "name": "British Indian Ocean Territory (the)",
            "numeric3": "086",
            "alpha2": "IO"
        },
        {
            "name": "Brunei Darussalam",
            "numeric3": "096",
            "alpha2": "BN"
        },
        {
            "name": "Bulgaria",
            "numeric3": "100",
            "alpha2": "BG"
        },
        {
            "name": "Burkina Faso",
            "numeric3": "854",
            "alpha2": "BF"
        },
        {
            "name": "Burundi",
            "numeric3": "108",
            "alpha2": "BI"
        },
        {
            "name": "Cabo Verde",
            "numeric3": "132",
            "alpha2": "CV"
        },
        {
            "name": "Cambodia",
            "numeric3": "116",
            "alpha2": "KH"
        },
        {
            "name": "Cameroon",
            "numeric3": "120",
            "alpha2": "CM"
        },
        {
            "name": "Canada",
            "numeric3": "124",
            "alpha2": "CA"
        },
        {
            "name": "Cayman Islands (the)",
            "numeric3": "136",
            "alpha2": "KY"
        },
        {
            "name": "Central African Republic (the)",
            "numeric3": "140",
            "alpha2": "CF"
        },
        {
            "name": "Chad",
            "numeric3": "148",
            "alpha2": "TD"
        },
        {
            "name": "Chile",
            "numeric3": "152",
            "alpha2": "CL"
        },
        {
            "name": "China",
            "numeric3": "156",
            "alpha2": "CN"
        },
        {
            "name": "Christmas Island",
            "numeric3": "162",
            "alpha2": "CX"
        },
        {
            "name": "Cocos (Keeling) Islands (the)",
            "numeric3": "166",
            "alpha2": "CC"
        },
        {
            "name": "Colombia",
            "numeric3": "170",
            "alpha2": "CO"
        },
        {
            "name": "Comoros (the)",
            "numeric3": "174",
            "alpha2": "KM"
        },
        {
            "name": "Congo (the Democratic Republic of the)",
            "numeric3": "180",
            "alpha2": "CD"
        },
        {
            "name": "Congo (the)",
            "numeric3": "178",
            "alpha2": "CG"
        },
        {
            "name": "Cook Islands (the)",
            "numeric3": "184",
            "alpha2": "CK"
        },
        {
            "name": "Costa Rica",
            "numeric3": "188",
            "alpha2": "CR"
        },
        {
            "name": "Côte d'Ivoire",
            "numeric3": "384",
            "alpha2": "CI"
        },
        {
            "name": "Croatia",
            "numeric3": "191",
            "alpha2": "HR"
        },
        {
            "name": "Cuba",
            "numeric3": "192",
            "alpha2": "CU"
        },
        {
            "name": "Curaçao",
            "numeric3": "531",
            "alpha2": "CW"
        },
        {
            "name": "Cyprus",
            "numeric3": "196",
            "alpha2": "CY"
        },
        {
            "name": "Czechia",
            "numeric3": "203",
            "alpha2": "CZ"
        },
        {
            "name": "Denmark",
            "numeric3": "208",
            "alpha2": "DK"
        },
        {
            "name": "Djibouti",
            "numeric3": "262",
            "alpha2": "DJ"
        },
        {
            "name": "Dominica",
            "numeric3": "212",
            "alpha2": "DM"
        },
        {
            "name": "Dominican Republic (the)",
            "numeric3": "214",
            "alpha2": "DO"
        },
        {
            "name": "Ecuador",
            "numeric3": "218",
            "alpha2": "EC"
        },
        {
            "name": "Egypt",
            "numeric3": "818",
            "alpha2": "EG"
        },
        {
            "name": "El Salvador",
            "numeric3": "222",
            "alpha2": "SV"
        },
        {
            "name": "Equatorial Guinea",
            "numeric3": "226",
            "alpha2": "GQ"
        },
        {
            "name": "Eritrea",
            "numeric3": "232",
            "alpha2": "ER"
        },
        {
            "name": "Estonia",
            "numeric3": "233",
            "alpha2": "EE"
        },
        {
            "name": "Eswatini",
            "numeric3": "748",
            "alpha2": "SZ"
        },
        {
            "name": "Ethiopia",
            "numeric3": "231",
            "alpha2": "ET"
        },
        {
            "name": "Falkland Islands (the) Malvinas",
            "numeric3": "238",
            "alpha2": "FK"
        },
        {
            "name": "Faroe Islands (the)",
            "numeric3": "234",
            "alpha2": "FO"
        },
        {
            "name": "Fiji",
            "numeric3": "242",
            "alpha2": "FJ"
        },
        {
            "name": "Finland",
            "numeric3": "246",
            "alpha2": "FI"
        },
        {
            "name": "France",
            "numeric3": "250",
            "alpha2": "FR"
        },
        {
            "name": "French Guiana",
            "numeric3": "254",
            "alpha2": "GF"
        },
        {
            "name": "French Polynesia",
            "numeric3": "258",
            "alpha2": "PF"
        },
        {
            "name": "French Southern Territories (the)",
            "numeric3": "260",
            "alpha2": "TF"
        },
        {
            "name": "Gabon",
            "numeric3": "266",
            "alpha2": "GA"
        },
        {
            "name": "Gambia (the)",
            "numeric3": "270",
            "alpha2": "GM"
        },
        {
            "name": "Georgia",
            "numeric3": "268",
            "alpha2": "GE"
        },
        {
            "name": "Germany",
            "numeric3": "276",
            "alpha2": "DE"
        },
        {
            "name": "Ghana",
            "numeric3": "288",
            "alpha2": "GH"
        },
        {
            "name": "Gibraltar",
            "numeric3": "292",
            "alpha2": "GI"
        },
        {
            "name": "Greece",
            "numeric3": "300",
            "alpha2": "GR"
        },
        {
            "name": "Greenland",
            "numeric3": "304",
            "alpha2": "GL"
        },
        {
            "name": "Grenada",
            "numeric3": "308",
            "alpha2": "GD"
        },
        {
            "name": "Guadeloupe",
            "numeric3": "312",
            "alpha2": "GP"
        },
        {
            "name": "Guam",
            "numeric3": "316",
            "alpha2": "GU"
        },
        {
            "name": "Guatemala",
            "numeric3": "320",
            "alpha2": "GT"
        },
        {
            "name": "Guernsey",
            "numeric3": "831",
            "alpha2": "GG"
        },
        {
            "name": "Guinea",
            "numeric3": "324",
            "alpha2": "GN"
        },
        {
            "name": "Guinea-Bissau",
            "numeric3": "624",
            "alpha2": "GW"
        },
        {
            "name": "Guyana",
            "numeric3": "328",
            "alpha2": "GY"
        },
        {
            "name": "Haiti",
            "numeric3": "332",
            "alpha2": "HT"
        },
        {
            "name": "Heard Island and McDonald Islands",
            "numeric3": "334",
            "alpha2": "HM"
        },
        {
            "name": "Holy See (the)",
            "numeric3": "336",
            "alpha2": "VA"
        },
        {
            "name": "Honduras",
            "numeric3": "340",
            "alpha2": "HN"
        },
        {
            "name": "Hong Kong",
            "numeric3": "344",
            "alpha2": "HK"
        },
        {
            "name": "Hungary",
            "numeric3": "348",
            "alpha2": "HU"
        },
        {
            "name": "Iceland",
            "numeric3": "352",
            "alpha2": "IS"
        },
        {
            "name": "India",
            "numeric3": "356",
            "alpha2": "IN"
        },
        {
            "name": "Indonesia",
            "numeric3": "360",
            "alpha2": "ID"
        },
        {
            "name": "Iran (Islamic Republic of)",
            "numeric3": "364",
            "alpha2": "IR"
        },
        {
            "name": "Iraq",
            "numeric3": "368",
            "alpha2": "IQ"
        },
        {
            "name": "Ireland",
            "numeric3": "372",
            "alpha2": "IE"
        },
        {
            "name": "Isle of Man",
            "numeric3": "833",
            "alpha2": "IM"
        },
        {
            "name": "Israel",
            "numeric3": "376",
            "alpha2": "IL"
        },
        {
            "name": "Italy",
            "numeric3": "380",
            "alpha2": "IT"
        },
        {
            "name": "Jamaica",
            "numeric3": "388",
            "alpha2": "JM"
        },
        {
            "name": "Japan",
            "numeric3": "392",
            "alpha2": "JP"
        },
        {
            "name": "Jersey",
            "numeric3": "832",
            "alpha2": "JE"
        },
        {
            "name": "Jordan",
            "numeric3": "400",
            "alpha2": "JO"
        },
        {
            "name": "Kazakhstan",
            "numeric3": "398",
            "alpha2": "KZ"
        },
        {
            "name": "Kenya",
            "numeric3": "404",
            "alpha2": "KE"
        },
        {
            "name": "Kiribati",
            "numeric3": "296",
            "alpha2": "KI"
        },
        {
            "name": "Korea (the Democratic People's Republic of)",
            "numeric3": "408",
            "alpha2": "KP"
        },
        {
            "name": "Korea (the Republic of)",
            "numeric3": "410",
            "alpha2": "KR"
        },
        {
            "name": "Kuwait",
            "numeric3": "414",
            "alpha2": "KW"
        },
        {
            "name": "Kyrgyzstan",
            "numeric3": "417",
            "alpha2": "KG"
        },
        {
            "name": "Lao People's Democratic Republic (the)",
            "numeric3": "418",
            "alpha2": "LA"
        },
        {
            "name": "Latvia",
            "numeric3": "428",
            "alpha2": "LV"
        },
        {
            "name": "Lebanon",
            "numeric3": "422",
            "alpha2": "LB"
        },
        {
            "name": "Lesotho",
            "numeric3": "426",
            "alpha2": "LS"
        },
        {
            "name": "Liberia",
            "numeric3": "430",
            "alpha2": "LR"
        },
        {
            "name": "Libya",
            "numeric3": "434",
            "alpha2": "LY"
        },
        {
            "name": "Liechtenstein",
            "numeric3": "438",
            "alpha2": "LI"
        },
        {
            "name": "Lithuania",
            "numeric3": "440",
            "alpha2": "LT"
        },
        {
            "name": "Luxembourg",
            "numeric3": "442",
            "alpha2": "LU"
        },
        {
            "name": "Macao",
            "numeric3": "446",
            "alpha2": "MO"
        },
        {
            "name": "North Macedonia",
            "numeric3": "807",
            "alpha2": "MK"
        },
        {
            "name": "Madagascar",
            "numeric3": "450",
            "alpha2": "MG"
        },
        {
            "name": "Malawi",
            "numeric3": "454",
            "alpha2": "MW"
        },
        {
            "name": "Malaysia",
            "numeric3": "458",
            "alpha2": "MY"
        },
        {
            "name": "Maldives",
            "numeric3": "462",
            "alpha2": "MV"
        },
        {
            "name": "Mali",
            "numeric3": "466",
            "alpha2": "ML"
        },
        {
            "name": "Malta",
            "numeric3": "470",
            "alpha2": "MT"
        },
        {
            "name": "Marshall Islands (the)",
            "numeric3": "584",
            "alpha2": "MH"
        },
        {
            "name": "Martinique",
            "numeric3": "474",
            "alpha2": "MQ"
        },
        {
            "name": "Mauritania",
            "numeric3": "478",
            "alpha2": "MR"
        },
        {
            "name": "Mauritius",
            "numeric3": "480",
            "alpha2": "MU"
        },
        {
            "name": "Mayotte",
            "numeric3": "175",
            "alpha2": "YT"
        },
        {
            "name": "Mexico",
            "numeric3": "484",
            "alpha2": "MX"
        },
        {
            "name": "Micronesia (Federated States of)",
            "numeric3": "583",
            "alpha2": "FM"
        },
        {
            "name": "Moldova (the Republic of)",
            "numeric3": "498",
            "alpha2": "MD"
        },
        {
            "name": "Monaco",
            "numeric3": "492",
            "alpha2": "MC"
        },
        {
            "name": "Mongolia",
            "numeric3": "496",
            "alpha2": "MN"
        },
        {
            "name": "Montenegro",
            "numeric3": "499",
            "alpha2": "ME"
        },
        {
            "name": "Montserrat",
            "numeric3": "500",
            "alpha2": "MS"
        },
        {
            "name": "Morocco",
            "numeric3": "504",
            "alpha2": "MA"
        },
        {
            "name": "Mozambique",
            "numeric3": "508",
            "alpha2": "MZ"
        },
        {
            "name": "Myanmar",
            "numeric3": "104",
            "alpha2": "MM"
        },
        {
            "name": "Namibia",
            "numeric3": "516",
            "alpha2": "NA"
        },
        {
            "name": "Nauru",
            "numeric3": "520",
            "alpha2": "NR"
        },
        {
            "name": "Nepal",
            "numeric3": "524",
            "alpha2": "NP"
        },
        {
            "name": "Netherlands (the)",
            "numeric3": "528",
            "alpha2": "NL"
        },
        {
            "name": "New Caledonia",
            "numeric3": "540",
            "alpha2": "NC"
        },
        {
            "name": "New Zealand",
            "numeric3": "554",
            "alpha2": "NZ"
        },
        {
            "name": "Nicaragua",
            "numeric3": "558",
            "alpha2": "NI"
        },
        {
            "name": "Niger (the)",
            "numeric3": "562",
            "alpha2": "NE"
        },
        {
            "name": "Nigeria",
            "numeric3": "566",
            "alpha2": "NG"
        },
        {
            "name": "Niue",
            "numeric3": "570",
            "alpha2": "NU"
        },
        {
            "name": "Norfolk Island",
            "numeric3": "574",
            "alpha2": "NF"
        },
        {
            "name": "Northern Mariana Islands (the)",
            "numeric3": "580",
            "alpha2": "MP"
        },
        {
            "name": "Norway",
            "numeric3": "578",
            "alpha2": "NO"
        },
        {
            "name": "Oman",
            "numeric3": "512",
            "alpha2": "OM"
        },
        {
            "name": "Pakistan",
            "numeric3": "586",
            "alpha2": "PK"
        },
        {
            "name": "Palau",
            "numeric3": "585",
            "alpha2": "PW"
        },
        {
            "name": "Palestine, State of",
            "numeric3": "275",
            "alpha2": "PS"
        },
        {
            "name": "Panama",
            "numeric3": "591",
            "alpha2": "PA"
        },
        {
            "name": "Papua New Guinea",
            "numeric3": "598",
            "alpha2": "PG"
        },
        {
            "name": "Paraguay",
            "numeric3": "600",
            "alpha2": "PY"
        },
        {
            "name": "Peru",
            "numeric3": "604",
            "alpha2": "PE"
        },
        {
            "name": "Philippines (the)",
            "numeric3": "608",
            "alpha2": "PH"
        },
        {
            "name": "Pitcairn",
            "numeric3": "612",
            "alpha2": "PN"
        },
        {
            "name": "Poland",
            "numeric3": "616",
            "alpha2": "PL"
        },
        {
            "name": "Portugal",
            "numeric3": "620",
            "alpha2": "PT"
        },
        {
            "name": "Puerto Rico",
            "numeric3": "630",
            "alpha2": "PR"
        },
        {
            "name": "Qatar",
            "numeric3": "634",
            "alpha2": "QA"
        },
        {
            "name": "Réunion",
            "numeric3": "638",
            "alpha2": "RE"
        },
        {
            "name": "Romania",
            "numeric3": "642",
            "alpha2": "RO"
        },
        {
            "name": "Russian Federation (the)",
            "numeric3": "643",
            "alpha2": "RU"
        },
        {
            "name": "Rwanda",
            "numeric3": "646",
            "alpha2": "RW"
        },
        {
            "name": "Saint Barthélemy",
            "numeric3": "652",
            "alpha2": "BL"
        },
        {
            "name": "Saint Helena Ascension Island Tristan da Cunha",
            "numeric3": "654",
            "alpha2": "SH"
        },
        {
            "name": "Saint Kitts and Nevis",
            "numeric3": "659",
            "alpha2": "KN"
        },
        {
            "name": "Saint Lucia",
            "numeric3": "662",
            "alpha2": "LC"
        },
        {
            "name": "Saint Martin (French part)",
            "numeric3": "663",
            "alpha2": "MF"
        },
        {
            "name": "Saint Pierre and Miquelon",
            "numeric3": "666",
            "alpha2": "PM"
        },
        {
            "name": "Saint Vincent and the Grenadines",
            "numeric3": "670",
            "alpha2": "VC"
        },
        {
            "name": "Samoa",
            "numeric3": "882",
            "alpha2": "WS"
        },
        {
            "name": "San Marino",
            "numeric3": "674",
            "alpha2": "SM"
        },
        {
            "name": "Sao Tome and Principe",
            "numeric3": "678",
            "alpha2": "ST"
        },
        {
            "name": "Saudi Arabia",
            "numeric3": "682",
            "alpha2": "SA"
        },
        {
            "name": "Senegal",
            "numeric3": "686",
            "alpha2": "SN"
        },
        {
            "name": "Serbia",
            "numeric3": "688",
            "alpha2": "RS"
        },
        {
            "name": "Seychelles",
            "numeric3": "690",
            "alpha2": "SC"
        },
        {
            "name": "Sierra Leone",
            "numeric3": "694",
            "alpha2": "SL"
        },
        {
            "name": "Singapore",
            "numeric3": "702",
            "alpha2": "SG"
        },
        {
            "name": "Sint Maarten (Dutch part)",
            "numeric3": "534",
            "alpha2": "SX"
        },
        {
            "name": "Slovakia",
            "numeric3": "703",
            "alpha2": "SK"
        },
        {
            "name": "Slovenia",
            "numeric3": "705",
            "alpha2": "SI"
        },
        {
            "name": "Solomon Islands",
            "numeric3": "090",
            "alpha2": "SB"
        },
        {
            "name": "Somalia",
            "numeric3": "706",
            "alpha2": "SO"
        },
        {
            "name": "South Africa",
            "numeric3": "710",
            "alpha2": "ZA"
        },
        {
            "name": "South Georgia and the South Sandwich Islands",
            "numeric3": "239",
            "alpha2": "GS"
        },
        {
            "name": "South Sudan",
            "numeric3": "728",
            "alpha2": "SS"
        },
        {
            "name": "Spain",
            "numeric3": "724",
            "alpha2": "ES"
        },
        {
            "name": "Sri Lanka",
            "numeric3": "144",
            "alpha2": "LK"
        },
        {
            "name": "Sudan (the)",
            "numeric3": "729",
            "alpha2": "SD"
        },
        {
            "name": "Suriname",
            "numeric3": "740",
            "alpha2": "SR"
        },
        {
            "name": "Svalbard Jan Mayen",
            "numeric3": "744",
            "alpha2": "SJ"
        },
        {
            "name": "Sweden",
            "numeric3": "752",
            "alpha2": "SE"
        },
        {
            "name": "Switzerland",
            "numeric3": "756",
            "alpha2": "CH"
        },
        {
            "name": "Syrian Arab Republic (the)",
            "numeric3": "760",
            "alpha2": "SY"
        },
        {
            "name": "Taiwan (Province of China)",
            "numeric3": "158",
            "alpha2": "TW"
        },
        {
            "name": "Tajikistan",
            "numeric3": "762",
            "alpha2": "TJ"
        },
        {
            "name": "Tanzania, the United Republic of",
            "numeric3": "834",
            "alpha2": "TZ"
        },
        {
            "name": "Thailand",
            "numeric3": "764",
            "alpha2": "TH"
        },
        {
            "name": "Timor-Leste",
            "numeric3": "626",
            "alpha2": "TL"
        },
        {
            "name": "Togo",
            "numeric3": "768",
            "alpha2": "TG"
        },
        {
            "name": "Tokelau",
            "numeric3": "772",
            "alpha2": "TK"
        },
        {
            "name": "Tonga",
            "numeric3": "776",
            "alpha2": "TO"
        },
        {
            "name": "Trinidad and Tobago",
            "numeric3": "780",
            "alpha2": "TT"
        },
        {
            "name": "Tunisia",
            "numeric3": "788",
            "alpha2": "TN"
        },
        {
            "name": "Turkey",
            "numeric3": "792",
            "alpha2": "TR"
        },
        {
            "name": "Turkmenistan",
            "numeric3": "795",
            "alpha2": "TM"
        },
        {
            "name": "Turks and Caicos Islands (the)",
            "numeric3": "796",
            "alpha2": "TC"
        },
        {
            "name": "Tuvalu",
            "numeric3": "798",
            "alpha2": "TV"
        },
        {
            "name": "Uganda",
            "numeric3": "800",
            "alpha2": "UG"
        },
        {
            "name": "Ukraine",
            "numeric3": "804",
            "alpha2": "UA"
        },
        {
            "name": "United Arab Emirates (the)",
            "numeric3": "784",
            "alpha2": "AE"
        },
        {
            "name": "United Kingdom of Great Britain and Northern Ireland (the)",
            "numeric3": "826",
            "alpha2": "GB"
        },
        {
            "name": "United States Minor Outlying Islands (the)",
            "numeric3": "581",
            "alpha2": "UM"
        },
        {
            "name": "United States of America (the)",
            "numeric3": "840",
            "alpha2": "US"
        },
        {
            "name": "Uruguay",
            "numeric3": "858",
            "alpha2": "UY"
        },
        {
            "name": "Uzbekistan",
            "numeric3": "860",
            "alpha2": "UZ"
        },
        {
            "name": "Vanuatu",
            "numeric3": "548",
            "alpha2": "VU"
        },
        {
            "name": "Venezuela (Bolivarian Republic of)",
            "numeric3": "862",
            "alpha2": "VE"
        },
        {
            "name": "Viet Nam",
            "numeric3": "704",
            "alpha2": "VN"
        },
        {
            "name": "Virgin Islands (British)",
            "numeric3": "092",
            "alpha2": "VG"
        },
        {
            "name": "Virgin Islands (U.S.)",
            "numeric3": "850",
            "alpha2": "VI"
        },
        {
            "name": "Wallis and Futuna",
            "numeric3": "876",
            "alpha2": "WF"
        },
        {
            "name": "Western Sahara",
            "numeric3": "732",
            "alpha2": "EH"
        },
        {
            "name": "Yemen",
            "numeric3": "887",
            "alpha2": "YE"
        },
        {
            "name": "Zambia",
            "numeric3": "894",
            "alpha2": "ZM"
        },
        {
            "name": "Zimbabwe",
            "numeric3": "716",
            "alpha2": "ZW"
        }
    ];

    return {
        /**
         * @param code country code corresponding to alpha2, alpha3 or numeric3
         * @returns {alpha2: String, numeric3: String, name: String}
         */
        lookup: function (code) {
            if (!code) {
                return;
            }
            for (let i = 0; i < codes.length; i++) {
                const codeMap = codes[i];
                if (String(code).toUpperCase() === codeMap.alpha2 || Number(code) === Number(codeMap.numeric3)) {
                    return codeMap;
                }
            }
        },
        codes: codes
    }
}());

/**
 * BCP 47 is a combination of country code ISO 3166 and language code ISO 639.
 *
 * This translates both codes.
 */
const bcp47 = (function (iso3166, iso639) {
    'use strict';

    return {
        lookup: function (code) {
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

/**
 * Implementation to quickly translate YouTube category codes.
 *
 * @link https://developers.google.com/youtube/v3/docs/videoCategories/list?apix_params=%7B%22part%22%3A%5B%22snippet%22%5D%2C%22regionCode%22%3A%22US%22%7D
 */
const ytCategory = (function () {
    'use strict';

    const categories = [
        {
            "kind": "youtube#videoCategory",
            "etag": "grPOPYEUUZN3ltuDUGEWlrTR90U",
            "id": "1",
            "snippet": {
                "title": "Film & Animation",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "Q0xgUf8BFM8rW3W0R9wNq809xyA",
            "id": "2",
            "snippet": {
                "title": "Autos & Vehicles",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "qnpwjh5QlWM5hrnZCvHisquztC4",
            "id": "10",
            "snippet": {
                "title": "Music",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "HyFIixS5BZaoBdkQdLzPdoXWipg",
            "id": "15",
            "snippet": {
                "title": "Pets & Animals",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "PNU8SwXhjsF90fmkilVohofOi4I",
            "id": "17",
            "snippet": {
                "title": "Sports",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "5kFljz9YJ4lEgSfVwHWi5kTAwAs",
            "id": "18",
            "snippet": {
                "title": "Short Movies",
                "assignable": false,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "ANnLQyzEA_9m3bMyJXMhKTCOiyg",
            "id": "19",
            "snippet": {
                "title": "Travel & Events",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "0Hh6gbZ9zWjnV3sfdZjKB5LQr6E",
            "id": "20",
            "snippet": {
                "title": "Gaming",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "q8Cp4pUfCD8Fuh8VJ_yl5cBCVNw",
            "id": "21",
            "snippet": {
                "title": "Videoblogging",
                "assignable": false,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "cHDaaqPDZsJT1FPr1-MwtyIhR28",
            "id": "22",
            "snippet": {
                "title": "People & Blogs",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "3Uz364xBbKY50a2s0XQlv-gXJds",
            "id": "23",
            "snippet": {
                "title": "Comedy",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "0srcLUqQzO7-NGLF7QnhdVzJQmY",
            "id": "24",
            "snippet": {
                "title": "Entertainment",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "bQlQMjmYX7DyFkX4w3kT0osJyIc",
            "id": "25",
            "snippet": {
                "title": "News & Politics",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "Y06N41HP_WlZmeREZvkGF0HW5pg",
            "id": "26",
            "snippet": {
                "title": "Howto & Style",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "yBaNkLx4sX9NcDmFgAmxQcV4Y30",
            "id": "27",
            "snippet": {
                "title": "Education",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "Mxy3A-SkmnR7MhJDZRS4DuAIbQA",
            "id": "28",
            "snippet": {
                "title": "Science & Technology",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "p3lEirEJApyEkuWpaGEHoF-m-aA",
            "id": "29",
            "snippet": {
                "title": "Nonprofits & Activism",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "4pIHL_AdN2kO7btAGAP1TvPucNk",
            "id": "30",
            "snippet": {
                "title": "Movies",
                "assignable": false,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "Iqol1myDwh2AuOnxjtn2AfYwJTU",
            "id": "31",
            "snippet": {
                "title": "Anime/Animation",
                "assignable": false,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "tzhBKCBcYWZLPai5INY4id91ss8",
            "id": "32",
            "snippet": {
                "title": "Action/Adventure",
                "assignable": false,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "ii8nBGYpKyl6FyzP3cmBCevdrbs",
            "id": "33",
            "snippet": {
                "title": "Classics",
                "assignable": false,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "Y0u9UAQCCGp60G11Arac5Mp46z4",
            "id": "34",
            "snippet": {
                "title": "Comedy",
                "assignable": false,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "_YDnyT205AMuX8etu8loOiQjbD4",
            "id": "35",
            "snippet": {
                "title": "Documentary",
                "assignable": false,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "eAl2b-uqIGRDgnlMa0EsGZjXmWg",
            "id": "36",
            "snippet": {
                "title": "Drama",
                "assignable": false,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "HDAW2HFOt3SqeDI00X-eL7OELfY",
            "id": "37",
            "snippet": {
                "title": "Family",
                "assignable": false,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "QHiWh3niw5hjDrim85M8IGF45eE",
            "id": "38",
            "snippet": {
                "title": "Foreign",
                "assignable": false,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "ztKcSS7GpH9uEyZk9nQCdNujvGg",
            "id": "39",
            "snippet": {
                "title": "Horror",
                "assignable": false,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "Ids1sm8QFeSo_cDlpcUNrnEBYWA",
            "id": "40",
            "snippet": {
                "title": "Sci-Fi/Fantasy",
                "assignable": false,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "qhfgS7MzzZHIy_UZ1dlawl1GbnY",
            "id": "41",
            "snippet": {
                "title": "Thriller",
                "assignable": false,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "TxVSfGoUyT7CJ7h7ebjg4vhIt6g",
            "id": "42",
            "snippet": {
                "title": "Shorts",
                "assignable": false,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "o9w6eNqzjHPnNbKDujnQd8pklXM",
            "id": "43",
            "snippet": {
                "title": "Shows",
                "assignable": false,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "mLdyKd0VgXKDI6GevTLBAcvRlIU",
            "id": "44",
            "snippet": {
                "title": "Trailers",
                "assignable": false,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        }
    ];

    return {
        /**
         * @param code video categoryId
         * @returns category title
         */
        lookup: function (code) {
            if (!code) {
                return;
            }
            for (let i = 0; i < categories.length; i++) {
                const category = categories[i];

                if (Number(category.id) === Number(code)) {
                    return category.snippet.title;
                }
            }
        }
    }
}());