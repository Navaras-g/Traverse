from functools import lru_cache

from fastembed import TextEmbedding

# 384-dim, ONNX runtime, no PyTorch — chosen specifically to stay light
_MODEL_NAME = "BAAI/bge-small-en-v1.5"


@lru_cache(maxsize=1)
def get_embedding_model() -> TextEmbedding:
    return TextEmbedding(model_name=_MODEL_NAME)


def embed_text(text: str) -> list[float]:
    model = get_embedding_model()
    return next(model.embed([text])).tolist()


def embed_texts(texts: list[str]) -> list[list[float]]:
    model = get_embedding_model()
    return [e.tolist() for e in model.embed(texts)]