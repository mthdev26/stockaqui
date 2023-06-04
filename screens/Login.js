import { Text, View, StyleSheet, KeyboardAvoidingView, Image, TextInput, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';


export default function Login({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [visivel, setVisivel] = useState(false);

    const handleValidation = () => {
        const db = SQLite.openDatabase('usuarios.db');

        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM usuarios WHERE LOWER(usuario) = ? AND senha = ?`,
                [username.toLowerCase(), password.toString()],
                (tx, result) => {
                    if (result.rows.length > 0) {
                        setIsValid(true)
                        setVisivel(true)
                    } else {
                        setIsValid(false);
                        setVisivel(true);
                    }
                },
                (_, error) => {
                    Alert.alert('Erro', 'Erro ao executar a consulta: ' + error);
                }
            );
        });
    };

    const handleCloseModal = () => {
        setVisivel(false);
        if (isValid) {
            navigation.navigate('Inicial');
        }
    };

    return (
        <KeyboardAvoidingView style={styles.background}>
            <Modal
                animationType='slide'
                transparent={true}
                visible={visivel}
            >
                <View style={styles.bxModal}>
                    {isValid
                        ? (<Text style={styles.txModal}>Seja bem vindo!</Text>)
                        : (<Text style={styles.txModal}>Ops!!! Usuário ou senha errada</Text>)
                    }
                    <Button
                        title='Fechar' onPress={handleCloseModal}
                    />
                </View>
            </Modal>
            <Text style={styles.texto}>Stock Aqui</Text>
            <View style={styles.viewLogo}>
                <Image style={styles.logo}
                    source={require('../assets/logo-og.png')}
                />
            </View>
            <View style={styles.container}>
                <TextInput style={styles.input}
                    placeholder='Usuário'
                    autoCorrect={false}
                    onChangeText={username => setUsername(username)}
                />
                <TextInput style={styles.input}
                    placeholder='Senha'
                    autoCorrect={false}
                    secureTextEntry={true}
                    onChangeText={password => setPassword(password)}
                />
                <TouchableOpacity style={styles.btmEntrar} onPress={handleValidation}>
                    <Text style={styles.txtEnviar}>Entrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btmCriarConta} onPress={() => navigation.navigate('Formulario')}>
                    <Text style={styles.txtCriarConta}>Criar Conta</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
    },
    background: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    logo: {
        height: 300,
        width: 300,
        marginTop: 10,
    },
    viewLogo: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 0,
        justifyContent: 'space-around',
    },
    texto: {
        fontSize: 24,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        backgroundColor: 'white',
        width: '90%',
        marginBottom: 15,
        color: '#222',
        fontSize: 20,
        borderRadius: 7,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    btmEntrar: {
        backgroundColor: '#007BFF',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'black',
    },
    txtEnviar: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    btmCriarConta: {
        marginTop: 15,
        color: '#F2F2F2',
    },
    txtCriarConta: {
        color: 'black',
    },
    bxModal: {
        backgroundColor: '#FFFFFF',
        margin: 20,
        padding: 20,
        borderRadius: 7,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    txModal: {
        fontSize: 17,
        fontWeight: 'bold',
        padding: 20,
    }
});

