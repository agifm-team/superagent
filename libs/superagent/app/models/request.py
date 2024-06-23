from enum import Enum
from typing import Any, Dict, List, Optional

from openai.types.beta.assistant_create_params import Tool as OpenAiAssistantTool
from pydantic import field_validator, BaseModel, Field

from prisma.enums import AgentType, LLMProvider, VectorDbProvider


class ApiUser(BaseModel):
    email: str
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    company: Optional[str] = None
    anonymousId: Optional[str] = None


class ApiKey(BaseModel):
    name: str


class OpenAiAssistantParameters(BaseModel):
    metadata: Optional[Dict[str, Any]] = None
    fileIds: Optional[List[str]] = None
    tools: Optional[List[OpenAiAssistantTool]] = None


class Agent(BaseModel):
    isActive: Optional[bool] = True
    name: str
    initialMessage: Optional[str] = None
    prompt: Optional[str] = None
    llmModel: Optional[str] = None
    llmProvider: Optional[LLMProvider] = None
    description: Optional[str] = "a helpful agent."
    avatar: Optional[str] = None
    type: Optional[AgentType] = AgentType.SUPERAGENT
    parameters: Optional[OpenAiAssistantParameters] = None
    metadata: Optional[dict] = None
    outputSchema: Optional[str] = None


class AgentUpdate(BaseModel):
    isActive: Optional[bool] = None
    name: Optional[str] = None
    initialMessage: Optional[str] = None
    prompt: Optional[str] = None
    llmModel: Optional[str] = None
    description: Optional[str] = None
    avatar: Optional[str] = None
    type: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    outputSchema: Optional[str] = None


class AgentLLM(BaseModel):
    llmId: str


class AgentDatasource(BaseModel):
    datasourceId: str


class LLMParams(BaseModel):
    max_tokens: Optional[int] = None
    temperature: Optional[float] = 0.5

    @field_validator("max_tokens")
    @classmethod
    def max_tokens_greater_than_1(v):
        if v < 1:
            raise ValueError("max_tokens must be greater than 1")
        return v

    @field_validator("temperature")
    @classmethod
    def temperature_between_0_and_2(v):
        if v < 0 or v > 2:
            raise ValueError("temperature must be between 0 and 2")
        return v


class AgentInvoke(BaseModel):
    input: str
    sessionId: Optional[str] = None
    enableStreaming: bool
    outputSchema: Optional[str] = None
    llm_params: Optional[LLMParams] = None


class EmbeddingsModelProvider(str, Enum):
    OPENAI = "OPENAI"
    AZURE_OPENAI = "AZURE_OPENAI"


class Datasource(BaseModel):
    name: str
    description: Optional[str] = None
    type: str
    content: Optional[str] = None
    url: Optional[str] = None
    metadata: Optional[Dict[Any, Any]] = None
    vectorDbId: Optional[str] = None
    embeddingsModelProvider: Optional[
        EmbeddingsModelProvider
    ] = EmbeddingsModelProvider.OPENAI


class DatasourceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    content: Optional[str] = None
    url: Optional[str] = None
    metadata: Optional[Dict[Any, Any]] = None
    vectorDbId: Optional[str] = None


class Tool(BaseModel):
    name: str
    description: Optional[str] = "a helpful tool."
    type: str
    metadata: Optional[Dict[Any, Any]] = None
    returnDirect: Optional[bool] = False


class ToolUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    metadata: Optional[Dict[Any, Any]] = None
    returnDirect: Optional[bool] = None


class AgentTool(BaseModel):
    toolId: str


class LLM(BaseModel):
    provider: str
    apiKey: str
    options: Optional[Dict] = None


class Workflow(BaseModel):
    name: str
    description: str


class WorkflowStep(BaseModel):
    order: int
    agentId: str


class WorkflowInvoke(BaseModel):
    input: str
    enableStreaming: bool
    sessionId: Optional[str] = None
    userEmail: Optional[str] = None
    outputSchemas: Optional[dict[str, str]] = Field(default_factory=dict)
    stream_token: Optional[bool] = None
    """A dictionary of step_id to output_schema 
        
        Example:
        ```
        {
            "step_id_1": "your output schema",
            "step_id_2": "your output schema"
        }
        ```
    """
    outputSchema: Optional[str] = None
    """The output schema that will be used for only the final output, 
    if output schema for last step is defined in outputSchemas, 
    it will be used instead of this one."""


class VectorDb(BaseModel):
    provider: VectorDbProvider
    options: Dict
