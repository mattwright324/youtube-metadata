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
            for (let i=0; i<codes.length; i++) {
                const codeMap = codes[i];
                if (String(code).toUpperCase() === codeMap.alpha2 || Number(code) === Number(codeMap.numeric3)) {
                    return codeMap;
                }
            }
        },
        codes: codes
    }
}());
