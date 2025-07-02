from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import os

chat_bp = Blueprint('chat', __name__)

# Note: In a real application, you would use a proper AI service
# For this demo, we'll simulate AI responses
def get_ai_response(message, conversation_history):
    """
    Simulate AI response for mental health support.
    In a real implementation, this would integrate with an actual AI service.
    """
    # Simple rule-based responses for demonstration
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['hello', 'hi', 'hey']):
        return "Hello! I'm here to support you. How are you feeling today?"
    
    elif any(word in message_lower for word in ['sad', 'depressed', 'down']):
        return "I'm sorry to hear you're feeling down. It's completely normal to have difficult days. Would you like to talk about what's been troubling you?"
    
    elif any(word in message_lower for word in ['anxious', 'worried', 'stress']):
        return "I understand that anxiety can be overwhelming. Let's try a simple breathing exercise together. Take a deep breath in for 4 counts, hold for 4, and exhale for 4. How does that feel?"
    
    elif any(word in message_lower for word in ['angry', 'frustrated', 'mad']):
        return "It sounds like you're experiencing some strong emotions. Anger is a valid feeling. What's been causing these feelings of frustration?"
    
    elif any(word in message_lower for word in ['help', 'support']):
        return "I'm here to help you. Remember that seeking support is a sign of strength. What kind of support would be most helpful for you right now?"
    
    elif any(word in message_lower for word in ['thank', 'thanks']):
        return "You're very welcome! I'm glad I could help. Remember, I'm always here when you need someone to talk to."
    
    else:
        return "I hear you. It's important to express your feelings. Can you tell me more about what you're experiencing? I'm here to listen and support you."

@chat_bp.route('/chat', methods=['POST'])
@cross_origin()
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '')
        conversation_history = data.get('history', [])
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get AI response
        ai_response = get_ai_response(message, conversation_history)
        
        # Add to conversation history
        conversation_history.append({'role': 'user', 'content': message})
        conversation_history.append({'role': 'assistant', 'content': ai_response})
        
        return jsonify({
            'response': ai_response,
            'history': conversation_history
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/chat/voice', methods=['POST'])
@cross_origin()
def voice_chat():
    """
    Handle voice input for chat.
    This would integrate with speech-to-text and text-to-speech services.
    """
    try:
        # For now, return a placeholder response
        return jsonify({
            'message': 'Voice chat functionality will be implemented with speech recognition and synthesis.',
            'status': 'placeholder'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/chat/mood', methods=['POST'])
@cross_origin()
def track_mood():
    """
    Track user's mood over time.
    """
    try:
        data = request.get_json()
        mood = data.get('mood', '')
        notes = data.get('notes', '')
        
        if not mood:
            return jsonify({'error': 'Mood is required'}), 400
        
        # In a real application, this would save to a database
        return jsonify({
            'message': f'Mood "{mood}" tracked successfully.',
            'mood': mood,
            'notes': notes,
            'timestamp': 'placeholder_timestamp'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

