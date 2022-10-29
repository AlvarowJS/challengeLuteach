from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status,permissions


from .serializers import (
    BookingSerializer,
)

from ..models import Booking


class BookingViewSet(ModelViewSet):
    queryset = Booking.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = BookingSerializer
    