import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('produtos.db');

const TelaDeDados = () => {
    const [produtos, setProdutos] = useState([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchProdutos();
    }, []);

    const fetchProdutos = () => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM produtos ORDER BY nome',
                [],
                (_, result) => {
                    const items = result.rows._array;
                    setProdutos(items);
                },
                (_, error) => {
                    console.log('Erro ao buscar os produtos:', error);
                }
            );
        });
    };

    const renderProduto = ({ item }) => {
        if (searchText && !item.nome.toLowerCase().includes(searchText.toLowerCase())) {
            return null;
        }

        const nomeProduto = item.nome.slice(0).toUpperCase();
        const quantidade = parseFloat(item.quantidade);
        const valor = parseFloat(item.valor);
        const precoMedio = parseFloat(item.precoMedio);

        return (
            <View style={styles.produtoContainer}>
                <Text style={styles.produtoNome}>{nomeProduto}</Text>
                <Text style={styles.texto}>Quantidade(s): {quantidade.toFixed(2).replace('.', ',')}</Text>
                <Text style={styles.texto}>Valor: R$ {valor.toFixed(2).replace('.', ',')}</Text>
                <Text style={styles.texto}>Preço médio: R$ {precoMedio.toFixed(2).replace('.', ',')}</Text>
            </View>
        );
    };

    const renderSeparator = () => (
        <View style={styles.separator} />
    );

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/posicao.png')}
                style={styles.posest}
            />
            <Text style={styles.titulo}>Posição de Estoque</Text>
            <Text style={styles.registros}>Registros apresentados: {produtos.length}</Text>
            <TextInput
                style={styles.input}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Digite o nome do produto"
            />
            <FlatList
                data={produtos}
                renderItem={renderProduto}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={renderSeparator}
                style={styles.listaProdutos}
            />
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
        color: '#007BFF',
    },
    posest: {
        height: 50,
        width: 50,
        marginTop: 10,
    },
    texto: {
        color: 'black',
        fontSize: 16
    },
    registros: {
        alignSelf: 'flex-end',
        marginRight: 10,
        marginBottom: 10,
        fontSize: 12,
        color: 'gray',
    },
    listaProdutos: {
        width: '90%',
    },
    produtoContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    produtoNome: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black',
        fontSize: 17,
    },
    input: {
        width: '90%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    separator: {
        height: 1,
        backgroundColor: 'black',
    },
});

export default TelaDeDados;
