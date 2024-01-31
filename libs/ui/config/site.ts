import { VectorDbProvider } from "@/models/models"
import { placeholder } from "@uiw/react-codemirror"
import { GoWorkflow } from "react-icons/go"
import {
  RxAvatar,
  RxDiscordLogo,
  RxFileText,
  RxGithubLogo,
  RxGlobe,
  RxPlay,
  RxReader,
} from "react-icons/rx"
import { TbBrain, TbDatabase, TbRobot } from "react-icons/tb"

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Superagent Cloud",
  description: "The agent framework for large language models",
  mainNav: [
    {
      title: "Agents",
      href: "/agents",
      icon: RxPlay,
    },
    {
      title: "workflows",
      href: "/workflows",
      icon: GoWorkflow,
    },
    {
      title: "datasources",
      href: "/datasources",
      icon: RxReader,
    },
    {
      title: "apis",
      href: "/apis",
      icon: RxGlobe,
    },
    {
      title: "llms",
      href: "/llms",
      icon: TbBrain,
    },
    {
      title: "vector databases",
      href: "/vector-databases",
      icon: TbDatabase,
    },
    {
      title: "Bots",
      href: "/bots",
      icon: TbRobot,
    }
  ],
  footerNav: [
    {
      title: "Discord",
      href: "https://discord.com/invite/mhmJUTjW4b",
      icon: RxDiscordLogo,
    },
    {
      title: "Github",
      href: "https://github.com/agifm-team/superagent",
      icon: RxGithubLogo,
    },
    {
      title: "Documentation",
      href: "https://docs.superagent.sh",
      icon: RxFileText,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: RxAvatar,
    },
  ],
  settingsNav: [
    {
      title: "User",
      href: "/settings",
    },
    {
      title: "Api keys",
      href: "/settings/api-keys",
    },
    {
      title: "Appearance",
      href: "/settings/appearance",
    },
    {
      title: "Billing",
      href: "/settings/billing",
      disabled: true,
    },
  ],
  defaultLLM: "GPT_3_5_TURBO_16K_0613",
  llms: [
    {
      id: "OPENAI",
      description:
        "Power your assistants with the latest models from OpenAI, powerful for calling external APIs and reasoning.",
      name: "OpenAI",
      logo: "/openai-logo.png",
      options: [
        {
          value: "GPT_3_5_TURBO_16K_0613",
          title: "gpt-3.5-turbo-16k-0613",
        },
        {
          value: "GPT_3_5_TURBO_0613",
          title: "gpt-3.5-turbo-0613",
        },
        {
          value: "GPT_3_5_TURBO_1106",
          title: "gpt-3.5-turbo-1106",
        },
        {
          value: "GPT_4_0613",
          title: "gpt-4-0613",
        },
        {
          value: "GPT_4_1106_PREVIEW",
          title: "gpt-4-1106-preview",
        },
      ],
    },
    {
      disabled: false,
      id: "AZURE_OPENAI",
      description:
        "Use Azure OpenAI to power your assistants with the latest OpenAI models.",
      name: "Azure OpenAI",
      logo: "/azure-logo.png",
      options: [],
    },
    {
      disabled: false,
      id: "OPENROUTER",
      description: "Find the best models & prices for your prompts",
      name: "OpenRouter",
      logo: "/openrouter-logo.png",
      options: [
        {
          value: "MISTRAL_7B_INSTRUCT",
          title: "mistral-7b-instruct",
        },
        {
          value: "NOUS_CAPYBARA_7B",
          title: "nous-capybara-7b",
        },
        {
          value: "OPENCHAT_7B",
          title: "openchat-7b",
        },
        {
          value: "ZEPHYR_7B_BETA",
          title: "zephyr-7b-beta",
        },
        {
          value: "MYTHOMIST_7B",
          title: "mythomist-7b",
        },
        { value: "CINEMATIKA_7B", title: "cinematika-7b" },
        { value: "RWKV_5_WORLD_3B", title: "rwkv-5-world-3b" },
        { value: "RWKV__5_3B_AI_TOWN", title: "rwkv-5-3b-ai-town" },
        { value: "BAGEL_34B", title: "bagel-34b" },
        { value: "CHRONOS_HERMES_13B", title: "chronos-hermes-13b" },
        { value: "PSYFIGHTER_13B_2", title: "psyfighter-13b-2" },
        {value: "NOROMAID_MIXTRAL_8X7B_INSTRUCT",title: "noromaid-mixtral-8x7b-instruct" },
        { value: "NOUS_HERMES_LLAMA2_13B", title: "nous-hermes-llama2-13b" },
        { value: "CODELLAMA_34B_INSTRUCT", title: "codellama-34b-instruct" },
        { value: "PHIND_CODELLAMA_34B", title: "phind-codellama-34b" },
        { value: "NEURAL_CHAT_7B", title: "neural-chat-7b" },
        { value: "LLAVA_13B", title: "llava-13b" },
        { value: "NOUS_HERMES_2_VISION_7B", title: "nous-hermes-2-vision-7b" },
        { value: "LLAMA_2_13B_CHAT", title: "llama-2-13b-chat" },
      ],
    },
    {
      disabled: true,
      id: "HUGGINGFACE",
      description: "Use Open Source models on HuggingFace.",
      name: "HuggingFace",
      logo: "/hf-logo.png",
      options: [
        {
          value: "MISTRAL_7B_INSTRUCT_V01",
          title: "mistral-7b-instruct-v0.1",
        },
      ],
    },
  ],
  datasourceTypes: [
    {
      value: "PDF",
      title: "PDF",
      type: "unstructured",
    },
    {
      value: "TXT",
      title: "TXT",
    },
    {
      value: "CSV",
      title: "CSV",
    },
    {
      value: "MARKDOWN",
      title: "Markdown",
    },
  ],
  toolTypes: [
    {
      value: "ALGOLIA",
      title: "Algolia Index",
      metadata: [
        {
          key: "index",
          type: "input",
          label: "Algolia Index",
        },
        {
          key: "appId",
          type: "input",
          label: "Algolia App ID",
        },
        {
          key: "apiKey",
          type: "password",
          label: "Algolia API Key",
        },
      ],
    },
    {
      value: "BING_SEARCH",
      title: "Bing Search",
      metadata: [
        {
          key: "bingSearchUrl",
          type: "input",
          label: "Bing Search URL",
        },
        {
          key: "bingSubscriptionKey",
          type: "input",
          label: "Bing Subscription Key",
        },
      ],
    },
    {
      value: "METAPHOR",
      title: "Metaphor Search",
      metadata: [
        {
          key: "metaphorApiKey",
          type: "input",
          label: "Metaphor API Key",
        },
      ],
    },
    {
      value: "CHATGPT_PLUGIN",
      title: "ChatGPT plugin",
      metadata: [
        {
          key: "chatgptPluginURL",
          type: "input",
          label: "Plugin manifest url",
        },
      ],
    },
    {
      value: "REPLICATE",
      title: "Replicate",
      metadata: [
        {
          key: "model",
          type: "input",
          label: "Model",
        },
        {
          key: "apiKey",
          type: "input",
          label: "Replicate API key",
        },
        {
          key: "arguments",
          type: "json",
          label: "Other arguments",
        },
      ],
    },
    {
      value: "HTTP",
      title: "API Request",
      metadata: [
        {
          key: "headers",
          type: "json",
          label: "Headers",
        },
      ],
    },
    {
      value: "PUBMED",
      title: "PubMed",
      metadata: [],
    },
    {
      value: "CODE_EXECUTOR",
      title: "Code interpreter (alpha)",
      metadata: [],
    },
    {
      value: "BROWSER",
      title: "Browser",
      metadata: [],
    },
    {
      value: "HAND_OFF",
      title: "Human hand-off (Alpha)",
      metadata: [],
    },
    {
      value: "FUNCTION",
      title: "Function",
      metadata: [
        {
          key: "functionName",
          type: "input",
          label: "Function name",
          helpText: "Use lowercase letters, ex: get_article",
        },
        {
          key: "args",
          type: "json",
          label: "Arguments",
          helpText: "Add function arguments in the following format",
          json: {
            title: { type: "string", description: "Article title" },
            url: { type: "string", description: "The url of the article" },
          },
        },
      ],
    },
    {
      value: "OPENAPI",
      title: "OpenAPI",
      metadata: [
        {
          key: "openApiUrl",
          type: "input",
          label: "OpenAPI spec url",
        },
        {
          key: "headers",
          type: "json",
          label: "Additional headers",
        },
      ],
    },
    {
      value: "GPT_VISION",
      title: "GPT Vision",
      metadata: [
        {
          key: "openaiApiKey",
          type: "input",
          label: "Your OpenAI API Key",
        },
      ],
    },
    {
      value: "TTS_1",
      title: "Text-To-Speech (TTS1)",
      metadata: [
        {
          key: "openaiApiKey",
          type: "input",
          label: "Your OpenAI API Key",
        },
      ],
    },
    {
      value: "WOLFRAM_ALPHA",
      title: "Wolfram Alpha",
      metadata: [
        {
          key: "appId",
          type: "input",
          label: "Wolfram App ID",
        },
      ],
    },
    {
      value: "ZAPIER_NLA",
      title: "Zapier Natural Language",
      metadata: [
        {
          key: "zapierNlaApiKey",
          type: "input",
          label: "Zapier NLA API key",
        },
        {
          key: "openaiApiKey",
          type: "input",
          label: "Your OpenAI API key",
        },
      ],
    },
    {
      value: "AGENT",
      title: "Agent",
      metadata: [
        {
          key: "agentId",
          type: "input",
          label: "Superagent Agent ID",
        },
        {
          key: "apiKey",
          type: "input",
          label: "Superagent API key",
        },
      ],
    },
  ],

  vectorDbs: [
    {
      provider: VectorDbProvider[VectorDbProvider.PINECONE],
      name: "Pinecone",
      description:
        "Cloud-based database for storing and searching vectors, enabling fast similarity comparisons. Scales well for large datasets.",
      formDescription: "Please enter your Pinecone credentials.",
      metadata: [
        {
          key: "PINECONE_API_KEY",
          type: "input",
          label: "Pinecone API Key",
        },
        {
          key: "PINECONE_ENVIRONMENT",
          type: "input",
          label: "Pinecone Environment",
        },
        {
          key: "PINECONE_INDEX",
          type: "input",
          label: "Pinecone Index",
        },
      ],
    },
    {
      provider: VectorDbProvider[VectorDbProvider.QDRANT],
      name: "Qdrant",
      description:
        "Open-source database optimized for efficient vector search and filtering. Handles large datasets effectively while requiring minimal resources.",
      formDescription: "Please enter your Qdrant credentials.",
      metadata: [
        {
          key: "QDRANT_API_KEY",
          type: "input",
          label: "Qdrant API Key",
        },
        {
          key: "QDRANT_HOST",
          type: "input",
          label: "Qdrant Host",
        },
        {
          key: "QDRANT_INDEX",
          type: "input",
          label: "Qdrant Index",
        },
      ],
    },
    {
      provider: VectorDbProvider[VectorDbProvider.ASTRA_DB],
      name: "Astra DB",
      description:
        "Serverless database built on Cassandra, offering integration with Pinecone for vector similarity search.",
      formDescription: "Please enter your Astra DB credentials",
      metadata: [
        {
          key: "ASTRA_DB_ID",
          type: "input",
          label: "Astra DB ID",
        },
        {
          key: "ASTRA_DB_REGION",
          type: "input",
          label: "Astra DB Region",
        },
        {
          key: "ASTRA_DB_APPLICATION_TOKEN",
          type: "input",
          label: "Astra DB Application Token",
        },
        {
          key: "ASTRA_DB_COLLECTION_NAME",
          type: "input",
          label: "Astra DB Collection Name",
        },
        {
          key: "ASTRA_DB_KEYSPACE_NAME",
          type: "input",
          label: "Astra DB Keyspace Name",
        },
      ],
    },
    {
      provider: VectorDbProvider[VectorDbProvider.WEAVIATE],
      name: "Weaviate",
      description:
        "Semantic vector database with schema-based organization. Supports both vector search and connections between data points like a graph.",
      formDescription: "Please enter your Weaviate credentials.",
      metadata: [
        {
          key: "WEAVIATE_API_KEY",
          type: "input",
          label: "Weaviate API Key",
        },
        {
          key: "WEAVIATE_URL",
          type: "input",
          label: "Weaviate URL",
        },
        {
          key: "WEAVIATE_INDEX",
          type: "input",
          label: "Weaviate Index",
        },
      ],
    },
    {
      provider: VectorDbProvider[VectorDbProvider.SUPABASE],
      name: "Supabase",
      description:
        "The pgvector extension is particularly useful for tasks such as vector similarity search, retrieval, generation, and clustering",
      formDescription: "Please enter your Supabase Pgvector credentials.",
      metadata: [
        {
          key: "SUPABASE_DB_URL",
          type: "input",
          label: "Database Connection URL",
          placeholder: "postgres://postgres:postgres@localhost:5432/postgres",
          helpText:
            "The connection URL for your database. You can find this in your Supabase dashboard.",
        },
        {
          key: "SUPABASE_TABLE_NAME",
          type: "input",
          label: "Table Name",
          placeholder: "my_collection",
          helpText:
            "The database table name which your vector embeddings will be stored in.",
        },
      ],
    },
  ],
}
