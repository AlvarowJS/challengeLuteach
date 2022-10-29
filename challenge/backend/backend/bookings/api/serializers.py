from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from ..models import Booking


class BookingSerializer(ModelSerializer):

    class Meta:
        model = Booking
        fields = '__all__'

    def validate(self, data):

        if data['buyer'] == data['provider']:
            raise serializers.ValidationError("You can't book yourself")
        return data