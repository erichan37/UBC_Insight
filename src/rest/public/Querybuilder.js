import * as React from "react";
import * as ReactDOM from "react-dom";


export const schema = {
    "title": "Courses",
    "id": "query",
    "properties": {
        "WHERE": {
            "id": "where",
            "title": "Filter by: ",
            "type": "object",
            // "enum": ["AND", "OR", "IS", "GT", "EQ", "LT", "NOT"],
            "oneOf": [{
                "properties": {
                    "WHERE": { "enum": ["Empty"] }
                }
            },
            {
                "properties": {
                    "WHERE": {
                        "enum": ["Is"]
                    },
                    "IS": {
                        "type": "object",
                        "title": "String value only",
                        "oneOf": [
                            {},
                            {
                                "properties": {
                                    "IS": {
                                        "enum": ["Department"]
                                    },
                                    "courses_dept": {
                                        "type": "string",
                                        "enum": ["aanb", "adhe", "anat", "anth", "apbi", "appp", "apsc", "arbc", "arch", "arcl", "arst", "arth", "asia", "asic", "astr", "astu", "atsc", "audi", "ba", "baac", "babs", "baen", "bafi", "bahr", "bait", "bala", "bama", "bams", "bapa", "basc", "basm", "baul", "bioc", "biof", "biol", "bmeg", "bota", "busi", "caps", "ccst", "ceen", "cell", "cens", "chbe", "chem", "chil", "chin", "cics", "civl", "clch", "clst", "cnps", "cnrs", "cnto", "coec", "cogs", "cohr", "comm", "cons", "cpen", "cpsc", "crwr", "dani", "dent", "dhyg", "eced", "econ", "edcp", "edst", "educ", "eece", "elec", "ends", "engl", "enph", "envr", "eosc", "epse", "etec", "fhis", "fipr", "fish", "fist", "fmst", "fnel", "fnh", "fnis", "food", "fopr", "fre", "fren", "frst", "gbpr", "geob", "geog", "germ", "gpp", "grek", "grsj", "gsat", "hebr", "hgse", "hinu", "hist", "hunu", "iar", "igen", "info", "isci", "ital", "itst", "iwme", "japn", "jrnl", "kin", "korn", "lais", "larc", "laso", "last", "latn", "law", "lfs", "libe", "libr", "ling", "lled", "math", "mdvl", "mech", "medg", "medi", "micb", "midw", "mine", "mrne", "mtrl", "musc", "name", "nest", "nrsc", "nurs", "obst", "onco", "path", "pcth", "pers", "phar", "phil", "phrm", "phth", "phys", "plan", "poli", "pols", "port", "psyc", "punj", "relg", "rgla", "rhsc", "rmes", "rmst", "rsot", "russ", "sans", "scan", "scie", "soci", "soil", "sowk", "span", "spha", "spph", "stat", "sts", "surg", "swed", "test", "thtr", "udes", "ufor", "urst", "ursy", "vant", "visa", "wood", "wrds", "zool"]
                                    }
                                }
                            },
                            {
                                "properties": {
                                    "IS": {
                                        "enum": ["Instructor"],
                                    },
                                    "courses_instructor": {
                                        "title": "search with partial name using * syntax",
                                        "type": "string"
                                    }
                                }
                            },
                            {
                                "properties": {
                                    "IS": {
                                        "enum": ["Title"]
                                    },
                                    "courses_title": {
                                        "type": "string"
                                    }
                                }
                            },
                            {
                                "properties": {
                                    "IS": {
                                        "enum": ["ID"],
                                    },
                                    "courses_id": {
                                        "type": "string"
                                    }
                                }
                            }
                        ],
                        "x-hints": {
                            "form": {
                                "selector": "IS",
                            }
                        }
                    }
                }
            },
            {
                "properties": {
                    "WHERE": {
                        "enum": ["Greater than"]
                    },
                    "GT": {
                        "type": "object",
                        "title": "Number value only",
                        "oneOf": [{},
                        {
                            "properties": {
                                "GT": {
                                    "enum": ["Average"]
                                },
                                "courses_avg": {
                                    "type": "number"
                                }
                            }
                        },
                        {
                            "properties": {
                                "GT": {
                                    "enum": ["Passed"],
                                },
                                "courses_pass": {
                                    "type": "number"
                                }
                            }
                        },
                        {
                            "properties": {
                                "GT": {
                                    "enum": ["Failed"]
                                },
                                "courses_fail": {
                                    "type": "number"
                                }
                            }
                        },
                        {
                            "properties": {
                                "GT": {
                                    "enum": ["Audited"],
                                },
                                "courses_audit": {
                                    "type": "number"
                                }
                            }
                        },
                        {
                            "properties": {
                                "GT": {
                                    "enum": ["Year"],
                                },
                                "courses_year": {
                                    "type": "number"
                                }
                            }
                        }
                        ],
                        "x-hints": {
                            "form": {
                                "selector": "GT",
                            }
                        }
                    }
                }
            },
            {
                "properties": {
                    "WHERE": {
                        "enum": ["Equal to"]
                    },
                    "EQ": {
                        "type": "object",
                        "title": "Number value only",
                        "oneOf": [{},
                        {
                            "properties": {
                                "EQ": {
                                    "enum": ["Average"]
                                },
                                "courses_avg": {
                                    "type": "number"
                                }
                            }
                        },
                        {
                            "properties": {
                                "EQ": {
                                    "enum": ["Passed"],
                                },
                                "courses_pass": {
                                    "type": "number"
                                }
                            }
                        },
                        {
                            "properties": {
                                "EQ": {
                                    "enum": ["Failed"]
                                },
                                "courses_fail": {
                                    "type": "number"
                                }
                            }
                        },
                        {
                            "properties": {
                                "EQ": {
                                    "enum": ["Audited"],
                                },
                                "courses_audit": {
                                    "type": "number"
                                }
                            }
                        },
                        {
                            "properties": {
                                "EQ": {
                                    "enum": ["Year"],
                                },
                                "courses_year": {
                                    "type": "number"
                                }
                            }
                        }
                        ],
                        "x-hints": {
                            "form": {
                                "selector": "EQ",
                            }
                        }
                    }
                }
            },
            {
                "properties": {
                    "WHERE": {
                        "enum": ["Lower than"]
                    },
                    "LT": {
                        "type": "object",
                        "title": "Number value only",
                        "oneOf": [{},
                        {
                            "properties": {
                                "LT": {
                                    "enum": ["Average"]
                                },
                                "courses_avg": {
                                    "type": "number"
                                }
                            }
                        },
                        {
                            "properties": {
                                "LT": {
                                    "enum": ["Passed"],
                                },
                                "courses_pass": {
                                    "type": "number"
                                }
                            }
                        },
                        {
                            "properties": {
                                "LT": {
                                    "enum": ["Failed"]
                                },
                                "courses_fail": {
                                    "type": "number"
                                }
                            }
                        },
                        {
                            "properties": {
                                "LT": {
                                    "enum": ["Audited"],
                                },
                                "courses_audit": {
                                    "type": "number"
                                }
                            }
                        },
                        {
                            "properties": {
                                "LT": {
                                    "enum": ["Year"],
                                },
                                "courses_year": {
                                    "type": "number"
                                }
                            }
                        }
                        ],
                        "x-hints": {
                            "form": {
                                "selector": "LT",
                            }
                        }
                    }
                }
            },
            {
                "properties": {
                    "WHERE": {
                        "enum": ["And"],
                    },
                    "AND": {
                        "title": "And = ",
                        "type": "array",
                        "minItems": 2,
                        "items": {
                            "type": "object",
                            "oneOf": [{},
                            {
                                "properties": {
                                    "AND": {
                                        "enum": ["Is"]
                                    },
                                    "IS": {
                                        "type": "object",
                                        "title": "+",
                                        "oneOf": [
                                            {},
                                            {
                                                "properties": {
                                                    "IS": {
                                                        "enum": ["Department"]
                                                    },
                                                    "courses_dept": {
                                                        "type": "string",
                                                        "enum": ["aanb", "adhe", "anat", "anth", "apbi", "appp", "apsc", "arbc", "arch", "arcl", "arst", "arth", "asia", "asic", "astr", "astu", "atsc", "audi", "ba", "baac", "babs", "baen", "bafi", "bahr", "bait", "bala", "bama", "bams", "bapa", "basc", "basm", "baul", "bioc", "biof", "biol", "bmeg", "bota", "busi", "caps", "ccst", "ceen", "cell", "cens", "chbe", "chem", "chil", "chin", "cics", "civl", "clch", "clst", "cnps", "cnrs", "cnto", "coec", "cogs", "cohr", "comm", "cons", "cpen", "cpsc", "crwr", "dani", "dent", "dhyg", "eced", "econ", "edcp", "edst", "educ", "eece", "elec", "ends", "engl", "enph", "envr", "eosc", "epse", "etec", "fhis", "fipr", "fish", "fist", "fmst", "fnel", "fnh", "fnis", "food", "fopr", "fre", "fren", "frst", "gbpr", "geob", "geog", "germ", "gpp", "grek", "grsj", "gsat", "hebr", "hgse", "hinu", "hist", "hunu", "iar", "igen", "info", "isci", "ital", "itst", "iwme", "japn", "jrnl", "kin", "korn", "lais", "larc", "laso", "last", "latn", "law", "lfs", "libe", "libr", "ling", "lled", "math", "mdvl", "mech", "medg", "medi", "micb", "midw", "mine", "mrne", "mtrl", "musc", "name", "nest", "nrsc", "nurs", "obst", "onco", "path", "pcth", "pers", "phar", "phil", "phrm", "phth", "phys", "plan", "poli", "pols", "port", "psyc", "punj", "relg", "rgla", "rhsc", "rmes", "rmst", "rsot", "russ", "sans", "scan", "scie", "soci", "soil", "sowk", "span", "spha", "spph", "stat", "sts", "surg", "swed", "test", "thtr", "udes", "ufor", "urst", "ursy", "vant", "visa", "wood", "wrds", "zool"]
                                                    }
                                                }
                                            },
                                            {
                                                "properties": {
                                                    "IS": {
                                                        "enum": ["Instructor"],
                                                    },
                                                    "courses_instructor": {
                                                        "title": "search with partial name using * syntax",
                                                        "type": "string"
                                                    }
                                                }
                                            },
                                            {
                                                "properties": {
                                                    "IS": {
                                                        "enum": ["Title"]
                                                    },
                                                    "courses_title": {
                                                        "type": "string"
                                                    }
                                                }
                                            },
                                            {
                                                "properties": {
                                                    "IS": {
                                                        "enum": ["ID"],
                                                    },
                                                    "courses_id": {
                                                        "type": "string"
                                                    }
                                                }
                                            }
                                        ],
                                        "x-hints": {
                                            "form": {
                                                "selector": "IS",
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                "properties": {
                                    "AND": {
                                        "enum": ["Greater than: a number"]
                                    },
                                    "GT": {
                                        "type": "object",
                                        "title": "+",
                                        "oneOf": [{},
                                        {
                                            "properties": {
                                                "GT": {
                                                    "enum": ["Average"]
                                                },
                                                "courses_avg": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "GT": {
                                                    "enum": ["Passed"],
                                                },
                                                "courses_pass": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "GT": {
                                                    "enum": ["Failed"]
                                                },
                                                "courses_fail": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "GT": {
                                                    "enum": ["Audited"],
                                                },
                                                "courses_audit": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "GT": {
                                                    "enum": ["Year"],
                                                },
                                                "courses_year": {
                                                    "type": "number"
                                                }
                                            }
                                        }
                                        ],
                                        "x-hints": {
                                            "form": {
                                                "selector": "GT",
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                "properties": {
                                    "AND": {
                                        "enum": ["Equal to: a number"]
                                    },
                                    "EQ": {
                                        "type": "object",
                                        "title": "+",
                                        "oneOf": [{},
                                        {
                                            "properties": {
                                                "EQ": {
                                                    "enum": ["Average"]
                                                },
                                                "courses_avg": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "EQ": {
                                                    "enum": ["Passed"],
                                                },
                                                "courses_pass": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "EQ": {
                                                    "enum": ["Failed"]
                                                },
                                                "courses_fail": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "EQ": {
                                                    "enum": ["Audited"],
                                                },
                                                "courses_audit": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "EQ": {
                                                    "enum": ["Year"],
                                                },
                                                "courses_year": {
                                                    "type": "number"
                                                }
                                            }
                                        }
                                        ],
                                        "x-hints": {
                                            "form": {
                                                "selector": "EQ",
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                "properties": {
                                    "AND": {
                                        "enum": ["Lower than: a number"]
                                    },
                                    "LT": {
                                        "type": "object",
                                        "title": "+",
                                        "oneOf": [{},
                                        {
                                            "properties": {
                                                "LT": {
                                                    "enum": ["Average"]
                                                },
                                                "courses_avg": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "LT": {
                                                    "enum": ["Passed"],
                                                },
                                                "courses_pass": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "LT": {
                                                    "enum": ["Failed"]
                                                },
                                                "courses_fail": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "LT": {
                                                    "enum": ["Audited"],
                                                },
                                                "courses_audit": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "LT": {
                                                    "enum": ["Year"],
                                                },
                                                "courses_year": {
                                                    "type": "number"
                                                }
                                            }
                                        }
                                        ],
                                        "x-hints": {
                                            "form": {
                                                "selector": "LT",
                                            }
                                        }
                                    }
                                }
                            }
                            ],
                            "x-hints": {
                                "form": {
                                    "selector": "AND",
                                }
                            }
                        }
                    }
                }
            },
            {
                "properties": {
                    "WHERE": {
                        "enum": ["Or"],
                    },
                    "OR": {
                        "title": "Or = ",
                        "type": "array",
                        "minItems": 2,
                        "items": {
                            "type": "object",
                            "oneOf": [{},
                            {
                                "properties": {
                                    "OR": {
                                        "enum": ["Is"]
                                    },
                                    "IS": {
                                        "type": "object",
                                        "title": "+",
                                        "oneOf": [
                                            {},
                                            {
                                                "properties": {
                                                    "IS": {
                                                        "enum": ["Department"]
                                                    },
                                                    "courses_dept": {
                                                        "type": "string",
                                                        "enum": ["aanb", "adhe", "anat", "anth", "apbi", "appp", "apsc", "arbc", "arch", "arcl", "arst", "arth", "asia", "asic", "astr", "astu", "atsc", "audi", "ba", "baac", "babs", "baen", "bafi", "bahr", "bait", "bala", "bama", "bams", "bapa", "basc", "basm", "baul", "bioc", "biof", "biol", "bmeg", "bota", "busi", "caps", "ccst", "ceen", "cell", "cens", "chbe", "chem", "chil", "chin", "cics", "civl", "clch", "clst", "cnps", "cnrs", "cnto", "coec", "cogs", "cohr", "comm", "cons", "cpen", "cpsc", "crwr", "dani", "dent", "dhyg", "eced", "econ", "edcp", "edst", "educ", "eece", "elec", "ends", "engl", "enph", "envr", "eosc", "epse", "etec", "fhis", "fipr", "fish", "fist", "fmst", "fnel", "fnh", "fnis", "food", "fopr", "fre", "fren", "frst", "gbpr", "geob", "geog", "germ", "gpp", "grek", "grsj", "gsat", "hebr", "hgse", "hinu", "hist", "hunu", "iar", "igen", "info", "isci", "ital", "itst", "iwme", "japn", "jrnl", "kin", "korn", "lais", "larc", "laso", "last", "latn", "law", "lfs", "libe", "libr", "ling", "lled", "math", "mdvl", "mech", "medg", "medi", "micb", "midw", "mine", "mrne", "mtrl", "musc", "name", "nest", "nrsc", "nurs", "obst", "onco", "path", "pcth", "pers", "phar", "phil", "phrm", "phth", "phys", "plan", "poli", "pols", "port", "psyc", "punj", "relg", "rgla", "rhsc", "rmes", "rmst", "rsot", "russ", "sans", "scan", "scie", "soci", "soil", "sowk", "span", "spha", "spph", "stat", "sts", "surg", "swed", "test", "thtr", "udes", "ufor", "urst", "ursy", "vant", "visa", "wood", "wrds", "zool"]
                                                    }
                                                }
                                            },
                                            {
                                                "properties": {
                                                    "IS": {
                                                        "enum": ["Instructor"],
                                                    },
                                                    "courses_instructor": {
                                                        "title": "search with partial name using * syntax",
                                                        "type": "string"
                                                    }
                                                }
                                            },
                                            {
                                                "properties": {
                                                    "IS": {
                                                        "enum": ["Title"]
                                                    },
                                                    "courses_title": {
                                                        "type": "string"
                                                    }
                                                }
                                            },
                                            {
                                                "properties": {
                                                    "IS": {
                                                        "enum": ["ID"],
                                                    },
                                                    "courses_id": {
                                                        "type": "string"
                                                    }
                                                }
                                            }
                                        ],
                                        "x-hints": {
                                            "form": {
                                                "selector": "IS",
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                "properties": {
                                    "OR": {
                                        "enum": ["Greater than: a number"]
                                    },
                                    "GT": {
                                        "type": "object",
                                        "title": "+",
                                        "oneOf": [{},
                                        {
                                            "properties": {
                                                "GT": {
                                                    "enum": ["Average"]
                                                },
                                                "courses_avg": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "GT": {
                                                    "enum": ["Passed"],
                                                },
                                                "courses_pass": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "GT": {
                                                    "enum": ["Failed"]
                                                },
                                                "courses_fail": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "GT": {
                                                    "enum": ["Audited"],
                                                },
                                                "courses_audit": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "GT": {
                                                    "enum": ["Year"],
                                                },
                                                "courses_year": {
                                                    "type": "number"
                                                }
                                            }
                                        }
                                        ],
                                        "x-hints": {
                                            "form": {
                                                "selector": "GT",
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                "properties": {
                                    "OR": {
                                        "enum": ["Equal to: a number"]
                                    },
                                    "EQ": {
                                        "type": "object",
                                        "title": "+",
                                        "oneOf": [{},
                                        {
                                            "properties": {
                                                "EQ": {
                                                    "enum": ["Average"]
                                                },
                                                "courses_avg": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "EQ": {
                                                    "enum": ["Passed"],
                                                },
                                                "courses_pass": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "EQ": {
                                                    "enum": ["Failed"]
                                                },
                                                "courses_fail": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "EQ": {
                                                    "enum": ["Audited"],
                                                },
                                                "courses_audit": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "EQ": {
                                                    "enum": ["Year"],
                                                },
                                                "courses_year": {
                                                    "type": "number"
                                                }
                                            }
                                        }
                                        ],
                                        "x-hints": {
                                            "form": {
                                                "selector": "EQ",
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                "properties": {
                                    "OR": {
                                        "enum": ["Lower than: a number"]
                                    },
                                    "LT": {
                                        "type": "object",
                                        "title": "+",
                                        "oneOf": [{},
                                        {
                                            "properties": {
                                                "LT": {
                                                    "enum": ["Average"]
                                                },
                                                "courses_avg": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "LT": {
                                                    "enum": ["Passed"],
                                                },
                                                "courses_pass": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "LT": {
                                                    "enum": ["Failed"]
                                                },
                                                "courses_fail": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "LT": {
                                                    "enum": ["Audited"],
                                                },
                                                "courses_audit": {
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "properties": {
                                                "LT": {
                                                    "enum": ["Year"],
                                                },
                                                "courses_year": {
                                                    "type": "number"
                                                }
                                            }
                                        }
                                        ],
                                        "x-hints": {
                                            "form": {
                                                "selector": "LT",
                                            }
                                        }
                                    }
                                }
                            }
                            ],
                            "x-hints": {
                                "form": {
                                    "selector": "OR",
                                }
                            }
                        }
                    }
                }
            }
            ],
            "x-hints": {
                "form": {
                    "selector": "WHERE",
                }
            },
        },
        "OPTIONS": {
            "title": "Options",
            "id": "options",
            "required": ["COLUMNS"],
            "properties": {
                "COLUMNS": {
                    "id": "columns",
                    "title": "Properties you want to display: min 1",
                    "minItems": 1,
                    "items": {
                        "type": "string",
                        "enum": ["", "courses_dept", "courses_instructor", "courses_title", "courses_id", "courses_avg", "courses_pass", "courses_fail", "courses_audit", "courses_year"],
                        "enumNames": ["Empty", "Department", "Instructor", "Title", "ID", "Average", "Passed", "Failed", "Audited", "Year"]
                    },
                    "type": "array"
                },
                "FORM": {
                    "title": "Display Type: ",
                    "enum": ["TABLE"]
                },
                "ORDER": {
                    "id": "order",
                    "properties": {
                        "dir": {
                            "id": "dir",
                            "type": "string",
                            "title": "Sort direction: ",
                            "enum": ["", "UP", "DOWN"]
                        },
                        "keys": {
                            "id": "keys",
                            "title": "Sort with key(s) from columns",
                            "items": {
                                "type": "string",
                                "enum": ["", "courses_dept", "courses_instructor", "courses_title", "courses_id", "courses_avg", "courses_pass", "courses_fail", "courses_audit", "courses_year"],
                                "enumNames": ["Empty", "Department", "Instructor", "Title", "ID", "Average", "Passed", "Failed", "Audited", "Year"]
                            },
                            "type": "array"
                        }
                    },
                    "type": "object"
                }
            },
            "type": "object"
        },
        "TRANSFORMATIONS": {
            "id": "transformations",
            "title": "Advanced search term:  \n (Columns and sort key(s) can only be Department and/or ID)",
            "oneOf": [
                {},
                {
                    "properties": {
                        "TRANSFORMATIONS": {
                            "enum": ["Highest Average"],
                        },
                    }
                },
                {
                    "properties": {
                        "TRANSFORMATIONS": {
                            "enum": ["Lowest Average"],
                        }
                    }
                },
                {
                    "properties": {
                        "TRANSFORMATIONS": {
                            "enum": ["Most Sections"],
                        }
                    }
                },
                {
                    "properties": {
                        "TRANSFORMATIONS": {
                            "enum": ["Most Passes"],
                        }
                    }
                },
                {
                    "properties": {
                        "TRANSFORMATIONS": {
                            "enum": ["Most Fails"],
                        }
                    }
                }

            ],
            "x-hints": {
                "form": {
                    "selector": "TRANSFORMATIONS",
                }
            },
            "type": "object"
        }
    },
    "type": "object"
}
