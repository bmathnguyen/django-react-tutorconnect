from rest_framework import serializers
from api.models import Review

class ReviewSerializer(serializers.ModelSerializer):
    student = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = ['id', 'student', 'rating', 'comment', 'created_at']
    
    def get_student(self, obj):
        return {
           'id': str(obj.student.user.id),
           'name': f"{obj.student.user.first_name} {obj.student.user.last_name}",
           'school': obj.student.school,
       }
    
class CreateReviewSerializer(serializers.ModelSerializer):
   class Meta:
       model = Review
       fields = ['rating', 'comment']
   
   def create(self, validated_data):
       tutor = self.context['tutor']
       student = self.context['request'].user.student_profile
       
       review = Review.objects.create(
           student=student,
           tutor=tutor,
           **validated_data
       )
       
       # Update tutor's rating
       tutor.update_rating()
       
       return review
