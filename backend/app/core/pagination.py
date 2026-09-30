from typing import List, Generic, TypeVar, Optional, Any
from pydantic import BaseModel
from sqlalchemy.orm import Query

T = TypeVar("T")

class PageMetadata(BaseModel):
    total_records: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_prev: bool

class PaginatedResponse(BaseModel, Generic[T]):
    data: List[T]
    meta: PageMetadata

class PaginationHelper:
    @staticmethod
    def paginate_query(query: Query, page: int = 1, page_size: int = 20) -> tuple[List[Any], PageMetadata]:
        page = max(1, page)
        page_size = min(max(1, page_size), 100) # Clamp between 1 and 100

        total_records = query.count()
        total_pages = (total_records + page_size - 1) // page_size if total_records > 0 else 1

        offset = (page - 1) * page_size
        items = query.offset(offset).limit(page_size).all()

        meta = PageMetadata(
            total_records=total_records,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_prev=page > 1
        )
        return items, meta