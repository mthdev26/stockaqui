import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('produtos.db');

const App = () => {
    const [nomeProduto, setNomeProduto] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [valor, setValor] = useState('');

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, quantidade TEXT, valor TEXT, precoMedio TEXT);'
            );
        });
    }, []);

    const adicionarProduto = () => {
        if (nomeProduto === '' || quantidade === '' || valor === '') {
            Alert.alert('Opss!!!', 'Nome do produto, quantidade e valor são obrigatórios!');
            return;
        }

        const nomeProdutoLowerCase = nomeProduto.toLowerCase();

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM produtos WHERE LOWER(nome) = ?',
                [nomeProdutoLowerCase],
                (_, result) => {
                    if (result.rows.length > 0) {
                        // Produto já existe, atualizar informações
                        const produtoExistente = result.rows.item(0);
                        const quantidadeAtual = parseFloat(produtoExistente.quantidade.replace(',', '.'));
                        const valorAtual = parseFloat(produtoExistente.valor.replace(',', '.'));
                        const novaQuantidade = quantidadeAtual + parseFloat(quantidade.replace(',', '.'));
                        const novoValor = (valorAtual + parseFloat(quantidade.replace(',', '.')) * parseFloat(valor.replace(',', '.'))).toFixed(2);
                        const novoPrecoMedio = (novoValor / novaQuantidade).toFixed(2);

                        tx.executeSql(
                            'UPDATE produtos SET quantidade = ?, valor = ?, precoMedio = ? WHERE LOWER(nome) = ?',
                            [novaQuantidade.toString(), novoValor.toString(), novoPrecoMedio.toString(), nomeProdutoLowerCase],
                            (_, result) => {
                                if (result.rowsAffected > 0) {
                                    Alert.alert('Ebaaa =D', 'Produto atualizado com sucesso!');
                                    setNomeProduto('');
                                    setQuantidade('');
                                    setValor('');
                                }
                            },
                            (_, error) => {
                                Alert.alert('Erro', 'Erro ao atualizar o produto: ' + error);
                            }
                        );
                    } else {
                        // Produto não existe, adicionar novo produto
                        const valorTotal = (parseFloat(valor.replace(',', '.')) * parseFloat(quantidade.replace(',', '.'))).toFixed(2);
                        tx.executeSql(
                            'INSERT INTO produtos (nome, quantidade, valor, precoMedio) VALUES (?, ?, ?, ?)',
                            [nomeProduto, quantidade.replace(',', '.'), valorTotal.toString(), valor.toString()],
                            (_, result) => {
                                if (result.rowsAffected > 0) {
                                    Alert.alert('Legal =P', 'Produto adicionado com sucesso!');
                                    setNomeProduto('');
                                    setQuantidade('');
                                    setValor(valorTotal.toString());
                                }
                            },
                            (_, error) => {
                                Alert.alert('Erro', 'Erro ao adicionar o produto: ' + error);
                            }
                        );
                    }
                },
                (_, error) => {
                    Alert.alert('Erro', 'Erro ao verificar se o produto já existe: ' + error);
                }
            );
        });
    };


    return (
        <View style={styles.container}>
            <Image style={styles.add}
                source={require('../assets/adicionar.jpg')}
            />
            <Text style={styles.titulo}>Inclusão de Produtos</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome do Produto"
                value={nomeProduto}
                onChangeText={setNomeProduto}
            />
            <TextInput
                style={styles.input}
                placeholder="Quantidade"
                keyboardType="numeric"
                value={quantidade}
                onChangeText={setQuantidade}
            />
            <TextInput
                style={styles.input}
                placeholder="Valor"
                keyboardType="numeric"
                value={valor}
                onChangeText={setValor}
            />
            <TouchableOpacity style={styles.button} onPress={adicionarProduto}>
                <Text style={styles.buttonText}>Adicionar</Text>
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
    add: {
        height: 85,
        width: 85,
        marginTop: 10,
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
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

export default App;
