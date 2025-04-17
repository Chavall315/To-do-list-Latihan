import { View, Text, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import tw from 'twrnc'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'

const index = () => {
  const [task, setTask] = React.useState('')
  const [list, setList] = React.useState([])
  const [isEditing, setIsEditing] = React.useState(false)
  const [editId, setEditId] = React.useState('')

  useEffect(() => {
    loadTask();
  }, []);

  const deleteTask = (id: string) => {
    const filtered = list.filter((item) => item.id !== id);
    setList(filtered);
  };

  const handleEdit = (id: string) => {
    const updated = list.map(item => item.id === editId ? { ...item, title: task.trim() } : item);
    
    setList(updated);
    setTask('');
    setIsEditing(false);
    setEditId(null);
  };

  const startEdit = (item: any) => {
    setTask(item.title);
    setIsEditing(true);
    setEditId(item.id);
  };
    

  const loadTask = async () => {
    try {
      const saved = await AsyncStorage.getItem('task');
      if (saved !== null) {
        setList(JSON.parse(saved));
      }
      console.log('Loading Data');
    } catch (error) {
      console.error('Error loading Data', error);
    }
  };

  const saveTask = async () => {
    try {
      await AsyncStorage.setItem('task', JSON.stringify(list));
      console.log('Data Telah Tersimpan');
    } catch (error) {
      console.error('Error saving Data', error);
    }
  };

  const addTask = () => {
    if (task.trim() === '') return;
    const newTask = {
      id: Date.now().toString(),
      title: task.trim(),
      completed: false // <-- tambahkan properti ini
     }
     setList([...list, newTask] as never);
     setTask('');
    };

    const toggleTaskCompleted = (id: string) => {
      const updatedList = list.map(item => {
        if (item.id === id) {
          return { ...item, completed: !item.completed };
        }
        return item;
      });
      setList(updatedList);
    };

    useEffect(() => {
      saveTask();
    }, [list]);
    
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={tw`flex-1 p-4`}>
          <Text style={tw`text-3xl font-bold text-white mb-4`}>To Do List</Text>
          <View style={tw`flex-row items-center justify-between mb-4 gap-4`}>
            <TextInput style={tw`border border-gray-300 rounded-lg p-2 w-70 text-white`} placeholder="tambahkan tugas" placeholderTextColor="#ffff" value={task} onChangeText={setTask}/>
            <TouchableOpacity style={tw`bg-blue-500 rounded-lg p-2`} onPress={isEditing ? handleEdit : addTask}> 
              <Text style={tw`text-white`}>Tambah</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={list}
            renderItem={({ item }) => (
              <View style={tw`bg-gray-800 p-4 flex-row justify-between rounded-lg mb-2`}>
                <TouchableOpacity onPress={() => toggleTaskCompleted(item.id)}>
                  <Ionicons name={item.completed ? 'checkbox' : 'square-outline'} size={24} color={item.completed ? 'green' : 'gray'}/>
                </TouchableOpacity>
                <Text style={tw`text-white p-2`}>{item.title}</Text>
                <View style={tw`flex-row gap-2`}>
                  <TouchableOpacity style={tw`bg-white shadow-lg border rounded-lg p-2`} onPress={() => startEdit(item)}>
                    <FontAwesome5 name='pen' size={24} color={'blue'}/>
                  </TouchableOpacity>

                  <TouchableOpacity style={tw`bg-white rounded-lg p-2`} onPress={() => deleteTask(item.id)}>
                    <FontAwesome5 name='trash' size={24} color={'red'}/>
                  </TouchableOpacity>
                </View> 
                
              </View>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`pb-20`}
            ListEmptyComponent={() => (
              <View style={tw`flex-1 justify-center items-center h-full`}>
                <Text style={tw`text-gray-500`}>Tidak ada tugas</Text>
              </View>
            )}
          />
        </View>
      </ScrollView> 
    </SafeAreaView>
    
  )
}

export default index