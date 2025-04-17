import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Alert } from 'react-native';


const Explore = () => {
  const [task, setTask] = useState('');
  const [subject, setSubject] = useState('');
  const [list, setList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [date, setDate] = useState('');


  useEffect(() => {
    loadTask();
  }, []);

  useEffect(() => {
    saveTask();
  }, [list]);

  const addTask = () => {
    if (task.trim() === '' || subject.trim() === '') return;
    const newTask = {
      id: Date.now().toString(),
      title: task.trim(),
      subject: subject.trim(),
      date: date.trim(),
      completed: false,
    };
    setList([...list, newTask]);
    setTask('');
    setSubject('');
    setDate('');
  };

  const handleEdit = () => {
    const updated = list.map(item =>
      item.id === editId ? { ...item, title: task, subject, date } : item
    );
    setList(updated);
    setIsEditing(false);
    setEditId(null);
    setTask('');
    setSubject('');
    setDate('');
  };

  const startEdit = (item) => {
    setTask(item.title);
    setSubject(item.subject);
    setEditId(item.id);
    setDate(item.date);
    setIsEditing(true);
  };

  const deleteTask = (id) => {
    Alert.alert(
      'Hapus Tugas?',
      'Apakah anda yakin ingin menghapus tugas ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            const filtered = list.filter(item => item.id !== id);
            setList(filtered);
          },
        },
      ]
    );
  };
  

  const toggleTaskCompleted = (id) => {
    const updated = list.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setList(updated);
  };

  const loadTask = async () => {
    try {
      const saved = await AsyncStorage.getItem('task');
      if (saved !== null) {
        setList(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTask = async () => {
    try {
      await AsyncStorage.setItem('task', JSON.stringify(list));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 px-4 pt-4`}>
      <Text style={tw`text-xl text-white font-bold mb-4`}>📒 Tugasku</Text>

      <TextInput
        placeholder="Ada tugas Apa hari ini?"
        placeholderTextColor="#999"
        style={tw`border p-3 rounded-lg mb-2 bg-gray-100`}
        value={task}
        onChangeText={setTask}
      />
      <TextInput
        placeholder="Mapelnya apa tu?"
        placeholderTextColor="#999"
        style={tw`border p-3 rounded-lg mb-2 bg-gray-100`}
        value={subject}
        onChangeText={setSubject}
      />

      <View style={tw`flex-row items-center gap-2 mb-2`}>
        <TextInput
          placeholder="Tanggal tugas (misal: 20 April 2025)"
          placeholderTextColor="#999"
          style={tw`flex-1 border p-3 rounded-lg bg-gray-100`}
          value={date}
          onChangeText={setDate}
        />
        <TouchableOpacity style={tw`p-3 bg-blue-900 rounded-lg`}>
          <FontAwesome5 name="calendar" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={tw`bg-blue-900 p-3 rounded-lg mb-4`}
        onPress={isEditing ? handleEdit : addTask}
      >
        <Text style={tw`text-white text-center font-bold`}>Tambah Tugas</Text>
      </TouchableOpacity>

      {list.length > 0 ? (
        <>
          <Text style={tw`text-xs text-gray-200 mb-2`}>ADA TUGAS NI KAMU!</Text>
          <FlatList
            data={list}
            keyExtractor={item => item.id}
            contentContainerStyle={tw`pb-20`}
            renderItem={({ item }) => (
              <View style={tw`bg-gray-800 p-4 rounded-lg mb-2 shadow-md border border-gray-200`}>
                <View style={tw`flex-row justify-between items-start`}>
                  <View style={tw`flex-row items-start gap-2`}>
                    <TouchableOpacity onPress={() => toggleTaskCompleted(item.id)}>
                      <Ionicons
                        name={item.completed ? 'checkbox' : 'square-outline'}
                        size={24}
                        color={item.completed ? 'green' : 'gray'}
                      />
                    </TouchableOpacity>
                    <View>
                      <Text style={tw`font-bold text-base text-white`}>{item.title}</Text>
                      <Text style={tw`text-sm text-gray-400`}>Mapel : {item.subject}</Text>
                      <Text style={tw`text-red-400 font-semibold mt-1`}>{item.date}</Text>
                    </View>
                  </View>
                  <View style={tw`flex-row gap-2`}>
                    <TouchableOpacity style={tw`bg-white shadow-lg border rounded-lg p-2`} onPress={() => startEdit(item)}>
                      <FontAwesome5 name="pen" size={20} color="navy" />
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`bg-white shadow-lg border rounded-lg p-2`} onPress={() => deleteTask(item.id)}>
                      <FontAwesome5 name="trash" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </>
      ) : (
        <View style={tw`items-center justify-center mt-10`}>
          <Text style={tw`text-yellow-500 bg-yellow-100 px-4 py-2 rounded-lg font-bold`}>
            YEAY GADA TUGAS KAMU
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Explore;
