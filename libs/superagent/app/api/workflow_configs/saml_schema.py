# flake8: noqa
from enum import Enum
from typing import Any, Optional

from pydantic import field_validator, BaseModel, Field
from app.models.request import LLMParams

from prisma.enums import LLMProvider


class SuperragEncoderType(str, Enum):
    openai = "openai"


class SuperragEncoder(BaseModel):
    type: SuperragEncoderType = Field(
        description="The provider of encoder to use for the index. e.g. `openai`"
    )
    name: str = Field(
        description="The model name to use for the encoder. e.g. `text-embedding-3-small` for OpenAI's model"
    )
    dimensions: int


class SuperragDatabaseProvider(str, Enum):
    pinecone = "pinecone"
    weaviate = "weaviate"
    qdrant = "qdrant"
    pgvector = "pgvector"


class SuperragIndex(BaseModel):
    name: str
    urls: list[str]
    use_for: str
    encoder: Optional[SuperragEncoder] = Field(
        None, description="The encoder to use for the index"
    )
    database_provider: Optional[SuperragDatabaseProvider] = Field(
        None, description="The vector database provider to use for the index"
    )
    interpreter_mode: Optional[bool] = False

    @field_validator("name")
    @classmethod
    def name_too_long(v):
        MAX_LENGTH = 24
        if len(v) > MAX_LENGTH:
            raise ValueError(
                f'SuperRag\'s "name" field should be less than {MAX_LENGTH} characters'
            )
        return v


class SuperragItem(BaseModel):
    index: Optional[SuperragIndex] = None


class Superrag(BaseModel):
    __root__: list[SuperragItem]


class Data(BaseModel):
    urls: list[str]
    use_for: str


class Tool(BaseModel):
    name: str
    use_for: str
    metadata: Optional[dict[str, Any]] = None


class ToolModel(BaseModel):
    # ~~~~~~Superagent tools~~~~~~
    browser: Optional[Tool] = None
    code_executor: Optional[Tool] = None
    hand_off: Optional[Tool] = None
    http: Optional[Tool] = None
    bing_search: Optional[Tool] = None
    replicate: Optional[Tool] = None
    algolia: Optional[Tool] = None
    metaphor: Optional[Tool] = None
    function: Optional[Tool] = None
    research: Optional[Tool] = None
    sec: Optional[Tool] = None
    # ~~~~~~Assistants as tools~~~~~~
    superagent: Optional["SuperagentAgentTool"] = None
    openai_assistant: Optional["OpenAIAgentTool"] = None
    llm: Optional["LLMAgentTool"] = None
    scraper: Optional[Tool] = None
    advanced_scraper: Optional[Tool] = None
    google_search: Optional[Tool] = None

    # OpenAI Assistant tools
    code_interpreter: Optional[Tool] = None
    retrieval: Optional[Tool] = None


class Tools(BaseModel):
    __root__: list[ToolModel]


class Assistant(BaseModel):
    name: str
    llm: str
    prompt: str
    intro: Optional[str] = None
    params: Optional[LLMParams] = None
    output_schema: Optional[Any] = None


# ~~~Agents~~~
class SuperagentAgent(Assistant):
    tools: Optional[Tools] = None
    data: Optional[Data] = Field(None, description="Deprecated! Use `superrag` instead.")
    superrag: Optional[Superrag] = None


class LLMAgent(Assistant):
    tools: Optional[Tools] = None
    superrag: Optional[Superrag] = None


class OpenAIAgent(Assistant):
    pass


class BaseAgentToolModel(BaseModel):
    use_for: str


class SuperagentAgentTool(BaseAgentToolModel, SuperagentAgent):
    pass


class OpenAIAgentTool(BaseAgentToolModel, OpenAIAgent):
    pass


class LLMAgentTool(BaseAgentToolModel, LLMAgent):
    pass


# This is for the circular reference between Agent, Assistant and ToolModel
# for assistant as tools
ToolModel.update_forward_refs()

SAML_OSS_LLM_PROVIDERS = [
    LLMProvider.PERPLEXITY.value,
    LLMProvider.TOGETHER_AI.value,
    LLMProvider.ANTHROPIC.value,
    LLMProvider.BEDROCK.value,
    LLMProvider.GROQ.value,
    LLMProvider.MISTRAL.value,
    LLMProvider.COHERE_CHAT.value,
]


class Workflow(BaseModel):
    superagent: Optional[SuperagentAgent] = None
    openai_assistant: Optional[OpenAIAgent] = None
    # ~~OSS LLM providers~~
    perplexity: Optional[LLMAgent] = None
    together_ai: Optional[LLMAgent] = None
    bedrock: Optional[LLMAgent] = None
    groq: Optional[LLMAgent] = None
    mistral: Optional[LLMAgent] = None
    cohere_chat: Optional[LLMAgent] = None
    anthropic: Optional[LLMAgent] = None
    llm: Optional[LLMAgent] = Field(
        None, description="Deprecated! Use LLM providers instead. e.g. `perplexity` or `together_ai`"
    )


class WorkflowConfigModel(BaseModel):
    workflows: list[Workflow] = Field(..., min_length=1)

    # TODO[pydantic]: We couldn't refactor this class, please create the `model_config` manually.
    # Check https://docs.pydantic.dev/dev-v2/migration/#changes-to-config for more information.
    class Config:
        @staticmethod
        def schema_extra(schema: dict[str, Any]) -> None:
            schema.pop("title", None)
            for prop in schema.get("properties", {}).values():
                prop.pop("title", None)
