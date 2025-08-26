import React, { useState } from 'react';
import { View, FlatList, Modal, TextInput, ScrollView, Alert, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  ThemedView, 
  ThemedText, 
  ThemedButton, 
  ThemedInput, 
  ThemedCard,
  ThemedIcon,
  ThemedBadge
} from '../theme/components';

interface Task {
  id: string;
  title: string;
  description: string;
  contact_id?: string;
  contact_name?: string;
  contact_email?: string;
  type: 'follow_up' | 'interview' | 'application' | 'networking' | 'research' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  created_at: string;
  completed_at?: string;
}

export const TasksScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Follow up with John Doe',
      description: 'Send follow-up email about software engineer position at Acme Corp',
      contact_id: 'contact-1',
      contact_name: 'John Doe',
      contact_email: 'john.doe@example.com',
      type: 'follow_up',
      priority: 'high',
      status: 'pending',
      due_date: '2024-01-20T10:00:00Z',
      created_at: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      title: 'Prepare for Google interview',
      description: 'Review system design concepts and practice coding problems',
      type: 'interview',
      priority: 'high',
      status: 'in_progress',
      due_date: '2024-01-22T14:00:00Z',
      created_at: '2024-01-16T09:00:00Z',
    },
    {
      id: '3',
      title: 'Apply to Microsoft',
      description: 'Submit application for Senior Software Engineer position',
      type: 'application',
      priority: 'medium',
      status: 'completed',
      due_date: '2024-01-18T17:00:00Z',
      created_at: '2024-01-17T11:00:00Z',
      completed_at: '2024-01-18T16:30:00Z',
    },
    {
      id: '4',
      title: 'Connect with Sarah Wilson',
      description: 'Send LinkedIn connection request and follow-up message',
      contact_id: 'contact-4',
      contact_name: 'Sarah Wilson',
      contact_email: 'sarah@startup.io',
      type: 'networking',
      priority: 'low',
      status: 'pending',
      due_date: '2024-01-25T12:00:00Z',
      created_at: '2024-01-18T15:00:00Z',
    },
    {
      id: '5',
      title: 'Research Apple company culture',
      description: 'Read about Apple\'s work environment and interview process',
      type: 'research',
      priority: 'medium',
      status: 'pending',
      due_date: '2024-01-21T18:00:00Z',
      created_at: '2024-01-19T08:00:00Z',
    },
  ]);

  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'follow_up' as Task['type'],
    priority: 'medium' as Task['priority'],
    due_date: '',
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in_progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'follow_up': return 'mail-outline';
      case 'interview': return 'people-outline';
      case 'application': return 'document-text-outline';
      case 'networking': return 'logo-linkedin';
      case 'research': return 'search-outline';
      default: return 'checkmark-circle-outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'follow_up': return 'text-blue-600';
      case 'interview': return 'text-purple-600';
      case 'application': return 'text-green-600';
      case 'networking': return 'text-indigo-600';
      case 'research': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedFilter === 'all') return true;
    return task.status === selectedFilter;
  });

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      type: newTask.type,
      priority: newTask.priority,
      status: 'pending',
      due_date: newTask.due_date || undefined,
      created_at: new Date().toISOString(),
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({
      title: '',
      description: '',
      type: 'follow_up',
      priority: 'medium',
      due_date: '',
    });
    setShowAddTask(false);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : undefined,
        };
      }
      return task;
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setTasks(prev => prev.filter(task => task.id !== taskId)),
        },
      ]
    );
  };

  const renderTask = ({ item }: { item: Task }) => (
    <ThemedCard 
      variant="elevated" 
      style={{ 
        marginBottom: 12, 
        padding: 16,
        opacity: item.status === 'completed' ? 0.75 : 1,
        borderLeftWidth: 4,
        borderLeftColor: item.status === 'completed' ? '#10b981' : 
                         item.priority === 'high' ? '#ef4444' :
                         item.priority === 'medium' ? '#f59e0b' : '#10b981'
      }}
    >
      <TouchableOpacity onPress={() => setSelectedTask(item)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <View style={{ flex: 1 }}>
            <ThemedText 
              size="lg" 
              weight="semibold" 
              style={{ 
                marginBottom: 4,
                textDecorationLine: item.status === 'completed' ? 'line-through' : 'none'
              }}
            >
              {item.title}
            </ThemedText>
            <ThemedText variant="secondary" size="sm">{item.description}</ThemedText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ 
              paddingHorizontal: 8, 
              paddingVertical: 4, 
              borderRadius: 12, 
              backgroundColor: item.priority === 'high' ? '#ef4444' : 
                             item.priority === 'medium' ? '#f59e0b' : '#10b981'
            }}>
              <ThemedText size="xs" weight="medium" style={{ color: '#fff' }}>
                {item.priority}
              </ThemedText>
            </View>
            <View style={{ 
              paddingHorizontal: 8, 
              paddingVertical: 4, 
              borderRadius: 12, 
              backgroundColor: item.status === 'completed' ? '#10b981' : 
                             item.status === 'in_progress' ? '#3b82f6' : 
                             item.status === 'cancelled' ? '#6b7280' : '#f59e0b'
            }}>
              <ThemedText size="xs" weight="medium" style={{ color: '#fff' }}>
                {item.status.replace('_', ' ')}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedIcon name={getTypeIcon(item.type) as any} size={16} style={{ marginRight: 4 }} />
              <ThemedText size="xs" style={{ textTransform: 'capitalize' }}>
                {item.type.replace('_', ' ')}
              </ThemedText>
            </View>
            {item.contact_name && (
              <ThemedText variant="secondary" size="xs">@{item.contact_name}</ThemedText>
            )}
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {item.due_date && (
              <ThemedText variant="secondary" size="xs">
                Due: {new Date(item.due_date).toLocaleDateString()}
              </ThemedText>
            )}
            <TouchableOpacity
              onPress={() => handleUpdateTaskStatus(item.id, 'completed')}
              style={{ padding: 4, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 4 }}
            >
              <ThemedIcon name="checkmark" size={16} style={{ color: '#10b981' }} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </ThemedCard>
  );

  return (
    <ThemedView variant="primary" style={{ flex: 1 }}>
      {/* Header */}
      <ThemedView variant="card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' }}>
        <View>
          <ThemedText size="2xl" weight="bold">Tasks</ThemedText>
          <ThemedText variant="secondary" size="sm" style={{ marginTop: 4 }}>
            Job search activities & follow-ups
          </ThemedText>
        </View>
        <ThemedButton
          onPress={() => setShowAddTask(true)}
          size="sm"
        >
          + New Task
        </ThemedButton>
      </ThemedView>

      {/* Stats Overview */}
      <View style={{ flexDirection: 'row', padding: 20, gap: 12 }}>
        <ThemedCard variant="elevated" style={{ flex: 1, alignItems: 'center', padding: 16 }}>
          <ThemedText size="2xl" weight="bold">
            {tasks.filter(t => t.status === 'pending').length}
          </ThemedText>
          <ThemedText variant="secondary" size="xs" style={{ marginTop: 4 }}>Pending</ThemedText>
        </ThemedCard>
        <ThemedCard variant="elevated" style={{ flex: 1, alignItems: 'center', padding: 16 }}>
          <ThemedText size="2xl" weight="bold">
            {tasks.filter(t => t.status === 'in_progress').length}
          </ThemedText>
          <ThemedText variant="secondary" size="xs" style={{ marginTop: 4 }}>In Progress</ThemedText>
        </ThemedCard>
        <ThemedCard variant="elevated" style={{ flex: 1, alignItems: 'center', padding: 16 }}>
          <ThemedText size="2xl" weight="bold">
            {tasks.filter(t => t.status === 'completed').length}
          </ThemedText>
          <ThemedText variant="secondary" size="xs" style={{ marginTop: 4 }}>Completed</ThemedText>
        </ThemedCard>
      </View>

      {/* Filters */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingTop: 0, gap: 8 }}>
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'in_progress', label: 'In Progress' },
          { key: 'completed', label: 'Completed' },
        ].map(filter => (
          <ThemedButton
            key={filter.key}
            onPress={() => setSelectedFilter(filter.key as any)}
            variant={selectedFilter === filter.key ? 'primary' : 'outline'}
            size="sm"
          >
            {filter.label}
          </ThemedButton>
        ))}
      </View>

      {/* Tasks List */}
      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Task Modal */}
      <Modal visible={showAddTask} animationType="slide" presentationStyle="pageSheet">
        <View className="flex-1 bg-gray-50">
          <View className="flex-row justify-between items-center p-5 bg-white border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-800">New Task</Text>
            <TouchableOpacity onPress={() => setShowAddTask(false)}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-5">
            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Task Title</Text>
                <TextInput
                  value={newTask.title}
                  onChangeText={(text) => setNewTask(prev => ({ ...prev, title: text }))}
                  placeholder="e.g., Follow up with John Doe"
                  className="bg-white p-4 rounded-xl border border-gray-200"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Description</Text>
                <TextInput
                  value={newTask.description}
                  onChangeText={(text) => setNewTask(prev => ({ ...prev, description: text }))}
                  placeholder="Describe what needs to be done..."
                  multiline
                  numberOfLines={3}
                  className="bg-white p-4 rounded-xl border border-gray-200"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Task Type</Text>
                <View className="flex-row flex-wrap gap-2">
                  {[
                    { key: 'follow_up', label: 'Follow Up', icon: 'mail-outline' },
                    { key: 'interview', label: 'Interview', icon: 'people-outline' },
                    { key: 'application', label: 'Application', icon: 'document-text-outline' },
                    { key: 'networking', label: 'Networking', icon: 'logo-linkedin' },
                    { key: 'research', label: 'Research', icon: 'search-outline' },
                    { key: 'other', label: 'Other', icon: 'checkmark-circle-outline' },
                  ].map(type => (
                    <TouchableOpacity
                      key={type.key}
                      onPress={() => setNewTask(prev => ({ ...prev, type: type.key as Task['type'] }))}
                      className={`px-4 py-2 rounded-lg border-2 ${
                        newTask.type === type.key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      <Text className={`font-medium text-sm ${
                        newTask.type === type.key ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Priority</Text>
                <View className="flex-row gap-2">
                  {[
                    { key: 'low', label: 'Low', color: 'bg-green-500' },
                    { key: 'medium', label: 'Medium', color: 'bg-yellow-500' },
                    { key: 'high', label: 'High', color: 'bg-red-500' },
                  ].map(priority => (
                    <TouchableOpacity
                      key={priority.key}
                      onPress={() => setNewTask(prev => ({ ...prev, priority: priority.key as Task['priority'] }))}
                      className={`px-4 py-2 rounded-lg ${
                        newTask.priority === priority.key ? priority.color : 'bg-gray-200'
                      }`}
                    >
                      <Text className={`font-medium text-sm ${
                        newTask.priority === priority.key ? 'text-white' : 'text-gray-700'
                      }`}>
                        {priority.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          <View className="p-5 bg-white border-t border-gray-200">
            <TouchableOpacity
              onPress={handleAddTask}
              className="bg-blue-500 p-4 rounded-xl"
            >
              <Text className="text-white font-semibold text-center">Create Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Task Detail Modal */}
      {selectedTask && (
        <Modal visible={true} animationType="slide" presentationStyle="pageSheet">
          <View className="flex-1 bg-white">
            <View className="flex-row justify-between items-center p-5 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-800">Task Details</Text>
              <TouchableOpacity onPress={() => setSelectedTask(null)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-5">
              <View className="space-y-6">
                <View>
                  <Text className="text-2xl font-bold text-gray-800 mb-2">{selectedTask.title}</Text>
                  <Text className="text-gray-600">{selectedTask.description}</Text>
                </View>

                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 mb-1">Type</Text>
                    <View className="flex-row items-center">
                      <Ionicons name={getTypeIcon(selectedTask.type)} size={16} className={getTypeColor(selectedTask.type)} />
                      <Text className={`ml-1 capitalize ${getTypeColor(selectedTask.type)}`}>
                        {selectedTask.type.replace('_', ' ')}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 mb-1">Priority</Text>
                    <View className={`px-2 py-1 rounded-full ${getPriorityColor(selectedTask.priority)} self-start`}>
                      <Text className="text-white text-xs font-medium capitalize">{selectedTask.priority}</Text>
                    </View>
                  </View>
                </View>

                {selectedTask.contact_name && (
                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-1">Contact</Text>
                    <Text className="text-gray-800">{selectedTask.contact_name}</Text>
                    <Text className="text-gray-500 text-sm">{selectedTask.contact_email}</Text>
                  </View>
                )}

                {selectedTask.due_date && (
                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-1">Due Date</Text>
                    <Text className="text-gray-800">
                      {new Date(selectedTask.due_date).toLocaleDateString()} at{' '}
                      {new Date(selectedTask.due_date).toLocaleTimeString()}
                    </Text>
                  </View>
                )}

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">Status</Text>
                  <View className={`px-3 py-2 rounded-lg ${getStatusColor(selectedTask.status)} self-start`}>
                    <Text className="text-white font-medium capitalize">
                      {selectedTask.status.replace('_', ' ')}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View className="p-5 border-t border-gray-200">
              <View className="flex-row gap-3">
                {selectedTask.status !== 'completed' && (
                  <TouchableOpacity
                    onPress={() => handleUpdateTaskStatus(selectedTask.id, 'completed')}
                    className="flex-1 bg-green-500 p-3 rounded-lg"
                  >
                    <Text className="text-white font-semibold text-center">Mark Complete</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handleDeleteTask(selectedTask.id)}
                  className="flex-1 bg-red-500 p-3 rounded-lg"
                >
                  <Text className="text-white font-semibold text-center">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ThemedView>
  );
};
