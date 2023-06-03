import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('produtos.db');

const DeletarItemTela = () => {
    const [nomeProduto, setNomeProduto] = useState('');

    const deletarProduto = () => {
        if (nomeProduto === '') {
            Alert.alert('Erro', 'Por favor, informe o nome do produto.');
            return;
        }

        const nomeProdutoLowerCase = nomeProduto.toLowerCase();

        Alert.alert(
            'Confirmação',
            'Tem certeza que deseja deletar o produto?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Deletar',
                    onPress: () => {
                        db.transaction((tx) => {
                            tx.executeSql(
                                'DELETE FROM produtos WHERE LOWER(nome) = ?',
                                [nomeProdutoLowerCase],
                                (_, result) => {
                                    if (result.rowsAffected > 0) {
                                        console.log('Produto removido com sucesso!');
                                        setNomeProduto('');
                                        Alert.alert('Sucesso =D', 'Produto removido com sucesso!');
                                    } else {
                                        console.log('Nenhum produto encontrado com o nome informado.');
                                        Alert.alert('Ah não =(', 'Nenhum produto encontrado com o nome informado.');
                                    }
                                },
                                (_, error) => {
                                    console.log('Erro ao deletar o produto:', error);
                                    Alert.alert('Erro', 'Erro ao deletar o produto: ' + error.message);
                                }
                            );
                        });
                    },
                },
            ]
        );
    };


    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Informe o nome do produto:</Text>
            <Text style={styles.obs}>Obs.: O produto e sua quantidade serão apagados dos registros. Essa ação é irreversível!</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome do Produto"
                value={nomeProduto}
                onChangeText={setNomeProduto}
            />
            <TouchableOpacity style={styles.button} onPress={deletarProduto}>
                <Text style={styles.buttonText}>Deletar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    obs: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 20,
    },
    input: {
        width: 250,
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        borderRadius: 20,
        padding: 10,
        width: 150,
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default DeletarItemTela;
