import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('usuarios.db');

const FormularioCadastro = () => {
    const [nome, setNome] = useState('');
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, usuario TEXT UNIQUE, senha TEXT, email TEXT);'
            );
        });
    }, []);

    const cadastrarUsuario = () => {
        if (nome === '' || usuario === '' || senha === '' || email === '') {
            Alert.alert('Ops!!!', 'Todos os campos são obrigatórios!');
            return;
        }

        const usuarioLowerCase = usuario.toLowerCase();

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM usuarios WHERE usuario = ?',
                [usuarioLowerCase],
                (_, result) => {
                    if (result.rows.length > 0) {
                        Alert.alert('Erro', 'Usuário já existe!');
                    } else {
                        tx.executeSql(
                            'INSERT INTO usuarios (nome, usuario, senha, email) VALUES (?, ?, ?, ?)',
                            [nome, usuarioLowerCase, senha, email],
                            (_, result) => {
                                if (result.rowsAffected > 0) {
                                    Alert.alert('Bem vindo!', 'Usuário cadastrado com sucesso!');
                                    setNome('');
                                    setUsuario('');
                                    setSenha('');
                                    setEmail('');
                                }
                            },
                            (_, error) => {
                                Alert.alert('Erro', 'Erro ao cadastrar usuário: ' + error);
                            }
                        );
                    }
                },
                (_, error) => {
                    Alert.alert('Erro', 'Erro ao verificar usuário existente: ' + error);
                }
            );
        });
    };

    return (
        <View style={styles.container}>
            <Image style={styles.form}
                source={require('../assets/formulario.png')}
            />
            <Text style={styles.label}>Cadastro de Usuario</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite seu nome"
                value={nome}
                onChangeText={setNome}
            />
            <TextInput
                style={styles.input}
                placeholder="Digite seu usuário"
                value={usuario}
                onChangeText={setUsuario}
            />
            <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
            />
            <TextInput
                style={styles.input}
                placeholder="Digite seu email"
                value={email}
                onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.button} onPress={cadastrarUsuario}>
                <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    form: {
        height: 85,
        width: 85,
        marginTop: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default FormularioCadastro;