LLM_MAPPING = {
    "GPT_3_5_TURBO_16K_0613": "gpt-3.5-turbo-16k-0613",
    "GPT_3_5_TURBO_0613": "gpt-3.5-turbo-0613",
    "GPT_3_5_TURBO_1106": "gpt-3.5-turbo-1106",
    "GPT_4_0613": "gpt-4-0613",
    "GPT_4_32K_0613": "gpt-4-32k-0613",
    "GPT_4_1106_PREVIEW": "gpt-4-1106-preview",
}

OPENROUTER_MAPPING = {
    "NOUS_CAPYBARA_7B" : "nousresearch/nous-capybara-7b",
    "MISTRAL_7B_INSTRUCT" : "mistralai/mistral-7b-instruct",
    "ZEPHYR_7B_BETA" : "huggingfaceh4/zephyr-7b-beta",
    "OPENCHAT_7B" : "openchat/openchat-7b",
    "MYTHOMIST_7B" : "gryphe/mythomist-7b"
}

LLM_PROVIDER_MAPPING = {
    "OPENAI": [
        "GPT_3_5_TURBO_16K_0613",
        "GPT_3_5_TURBO_0613",
        "GPT_3_5_TURBO_1106",
        "GPT_4_0613",
        "GPT_4_32K_0613",
        "GPT_4_1106_PREVIEW",
    ],
    "OPENROUTER" : [
        "NOUS_CAPYBARA_7B",
        "MISTRAL_7B_INSTRUCT",
        "ZEPHYR_7B_BETA",
        "OPENCHAT_7B",
        "MYTHOMIST_7B",
    ]
}
