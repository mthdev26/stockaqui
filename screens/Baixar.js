import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('produtos.db');

const TelaDeBaixa = () => {
    const [nomeProduto, setNomeProduto] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [valor, setValor] = useState('');

    const baixarProduto = () => {
        if (nomeProduto === '' || quantidade === '') {
            Alert.alert('Erro', 'Produto e quantidade são obrigatórios!');
            return;
        }

        const nomeProdutoLowerCase = nomeProduto.toLowerCase();

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM produtos WHERE LOWER(nome) = ?',
                [nomeProdutoLowerCase],
                (_, result) => {
                    if (result.rows.length > 0) {
                        const produtoExistente = result.rows.item(0);
                        const quantidadeAtual = parseFloat(produtoExistente.quantidade.replace(',', '.'));
                        const quantidadeBaixa = parseFloat(quantidade.replace(',', '.'));
                        const precoMedioAtual = parseFloat(produtoExistente.precoMedio.replace(',', '.'));

                        if (quantidadeBaixa <= quantidadeAtual) {
                            const novaQuantidade = quantidadeAtual - quantidadeBaixa;
                            const novoValor = precoMedioAtual * (quantidadeAtual - quantidadeBaixa);

                            tx.executeSql(
                                'UPDATE produtos SET quantidade = ?, valor = ? WHERE LOWER(nome) = ?',
                                [novaQuantidade.toString(), novoValor, nomeProdutoLowerCase],
                                (_, result) => {
                                    if (result.rowsAffected > 0) {
                                        Alert.alert('Ebaa =)', 'Baixa de produto realizada com sucesso!');
                                        setNomeProduto('');
                                        setQuantidade('');
                                        setValor(novoValor);
                                    }
                                },
                                (_, error) => {
                                    Alert.alert('Erro', 'Erro ao atualizar a quantidade do produto: ' + error);
                                }
                            );
                        } else {
                            Alert.alert('Ah não! =(', 'Quantidade insuficiente para realizar a baixa!');
                        }
                    } else {
                        Alert.alert('Ops!!!', 'Produto não encontrado!');
                    }
                },
                (_, error) => {
                    Alert.alert('Erro', 'Erro ao buscar o produto: ' + error);
                }
            );
        });
    };


    return (
        <View style={styles.container}>
            <Image style={styles.remov}
                source={require('../assets/baixa.png')}
            />
            <Text style={styles.titulo}>Baixa de Produtos</Text>
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
            <TouchableOpacity style={styles.button} onPress={baixarProduto}>
                <Text style={styles.buttonText}>Baixar</Text>
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
    remov: {
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

export default TelaDeBaixa;
