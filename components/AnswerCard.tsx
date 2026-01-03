import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Answer } from '@/types/qa';
import { Colors } from '@/constants/colors';

interface AnswerCardProps {
  answer: Answer;
  onVote: (type: 'upvote' | 'downvote') => void;
  onMarkHelpful: () => void;
  userVote?: 'upvote' | 'downvote';
}

export const AnswerCard: React.FC<AnswerCardProps> = ({ 
  answer, 
  onVote, 
  onMarkHelpful,
  userVote 
}) => {
  const isHelpful = answer.helpfulCount > 0;

  return (
    <View style={[styles.container, isHelpful && styles.helpfulBorder]}>
      {isHelpful && (
        <View style={styles.helpfulBadge}>
          <Ionicons name="checkmark-circle" size={12} color="white" />
          <Text style={styles.helpfulBadgeText}>Helpful</Text>
        </View>
      )}
      
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{answer.userId.substring(5, 7).toUpperCase()}</Text>
        </View>
        <View>
          <Text style={styles.userName}>Student {answer.userId.substring(5, 10)}</Text>
          <Text style={styles.timestamp}>{new Date(answer.createdAt).toLocaleString()}</Text>
        </View>
        {answer.isAIGenerated && (
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>Smarty AI</Text>
          </View>
        )}
      </View>

      <Text style={styles.text}>{answer.text}</Text>
      
      {answer.photo && (
        <Image source={{ uri: answer.photo }} style={styles.answerImage} resizeMode="contain" />
      )}

      <View style={styles.footer}>
        <View style={styles.voteContainer}>
          <TouchableOpacity 
            onPress={() => onVote('upvote')}
            style={[styles.voteBtn, userVote === 'upvote' && styles.activeUpvote]}
          >
            <Ionicons 
              name={userVote === 'upvote' ? "caret-up" : "caret-up-outline"} 
              size={20} 
              color={userVote === 'upvote' ? "white" : Colors.light.textSecondary} 
            />
          </TouchableOpacity>
          
          <Text style={[
            styles.voteCount,
            (answer.upvoteCount - answer.downvoteCount) > 0 && { color: Colors.light.success },
            (answer.upvoteCount - answer.downvoteCount) < 0 && { color: Colors.light.error }
          ]}>
            {(answer.upvoteCount || 0) - (answer.downvoteCount || 0)}
          </Text>

          <TouchableOpacity 
            onPress={() => onVote('downvote')}
            style={[styles.voteBtn, userVote === 'downvote' && styles.activeDownvote]}
          >
            <Ionicons 
              name={userVote === 'downvote' ? "caret-down" : "caret-down-outline"} 
              size={20} 
              color={userVote === 'downvote' ? "white" : Colors.light.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.helpfulBtn, isHelpful && styles.helpfulBtnActive]} 
          onPress={onMarkHelpful}
        >
          <Ionicons 
            name={isHelpful ? "bulb" : "bulb-outline"} 
            size={18} 
            color={isHelpful ? Colors.light.accent : Colors.light.textSecondary} 
          />
          <Text style={[styles.helpfulText, isHelpful && styles.helpfulTextActive]}>
            {isHelpful ? `${answer.helpfulCount} Helpful` : 'Mark Helpful'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  helpfulBorder: {
    borderColor: Colors.light.accent,
    borderWidth: 2,
  },
  helpfulBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: Colors.light.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  helpfulBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  aiBadge: {
    marginLeft: 'auto',
    backgroundColor: Colors.light.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aiBadgeText: {
    fontSize: 10,
    color: Colors.light.primary,
    fontWeight: '700',
  },
  text: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  answerImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 12,
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 4,
  },
  voteBtn: {
    padding: 6,
    borderRadius: 16,
  },
  activeUpvote: {
    backgroundColor: Colors.light.success,
  },
  activeDownvote: {
    backgroundColor: Colors.light.error,
  },
  voteCount: {
    fontSize: 14,
    fontWeight: '700',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  helpfulBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  helpfulBtnActive: {
    borderColor: Colors.light.accent,
    backgroundColor: Colors.light.accent + '10',
  },
  helpfulText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  helpfulTextActive: {
    color: Colors.light.accent,
  },
});
