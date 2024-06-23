from typing import Any, List, Optional

from pydantic import BaseModel

from prisma.models import (
    LLM as LLMModel,
)
from prisma.models import (
    Agent as AgentModel,
)
from prisma.models import (
    AgentDatasource as AgentDatasourceModel,
)
from prisma.models import (
    AgentTool as AgentToolModel,
)
from prisma.models import (
    ApiKey as ApiKeyModel,
)
from prisma.models import (
    ApiUser as ApiUserModel,
)
from prisma.models import (
    Datasource as DatasourceModel,
)
from prisma.models import (
    Tool as ToolModel,
)
from prisma.models import (
    VectorDb as VectorDbModel,
)
from prisma.models import (
    Workflow as WorkflowModel,
)
from prisma.models import (
    WorkflowStep as WorkflowStepModel,
)


class ApiUser(BaseModel):
    success: bool
    data: Optional[ApiUserModel] = None


class _ApiKeyCreateModel(ApiKeyModel):
    apiKey: str


class ApiKeyCreate(BaseModel):
    success: bool
    data: Optional[_ApiKeyCreateModel] = None


class ApiKey(BaseModel):
    success: bool
    data: Optional[ApiKeyModel] = None


class ApiKeyList(BaseModel):
    success: bool
    data: Optional[list[ApiKeyModel]] = None


class Agent(BaseModel):
    success: bool
    data: Optional[AgentModel] = None


class AgentDatasource(BaseModel):
    success: bool
    data: Optional[AgentDatasourceModel] = None


class AgentDatasosurceList(BaseModel):
    success: bool
    data: Optional[List[AgentDatasourceModel]] = None


class AgentRunList(BaseModel):
    success: bool
    data: Optional[List[dict]] = None


class AgentTool(BaseModel):
    success: bool
    data: Optional[AgentToolModel] = None


class AgentToolList(BaseModel):
    success: bool
    data: Optional[List[AgentToolModel]] = None


class AgentInvoke(BaseModel):
    success: bool
    data: Any = None


class Datasource(BaseModel):
    success: bool
    data: Optional[DatasourceModel] = None


class DatasourceList(BaseModel):
    success: bool
    data: Optional[List[DatasourceModel]] = None
    total_pages: int


class Tool(BaseModel):
    success: bool
    data: Optional[ToolModel] = None


class ToolList(BaseModel):
    success: bool
    data: Optional[List[ToolModel]] = None
    total_pages: int


class AgentList(BaseModel):
    success: bool
    data: Optional[List[AgentModel]] = None
    total_pages: int


class LLM(BaseModel):
    success: bool
    data: Optional[LLMModel] = None


class LLMList(BaseModel):
    success: bool
    data: Optional[List[LLMModel]] = None


class Workflow(BaseModel):
    success: bool
    data: Optional[WorkflowModel] = None


class WorkflowStep(BaseModel):
    success: bool
    data: Optional[WorkflowStepModel] = None


class WorkflowList(BaseModel):
    success: bool
    data: Optional[List[WorkflowModel]] = None
    total_pages: int


class WorkflowStepList(BaseModel):
    success: bool
    data: Optional[List[WorkflowStepModel]] = None


class VectorDb(BaseModel):
    success: bool
    data: Optional[VectorDbModel] = None


class VectorDbList(BaseModel):
    success: bool
    data: Optional[List[VectorDbModel]] = None
