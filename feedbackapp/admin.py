from django.contrib import admin
from .models import Feedback  # or whatever your model is called


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('name', 'visit_date', 'visit_time', 'overall_rating', 'recommendation')
    list_filter = ('visit_time', 'recommendation')
    search_fields = ('name', 'email', 'comment', 'suggestions')
