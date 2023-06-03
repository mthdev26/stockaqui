import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

const TelaComBotoes = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/inicial.jpg')}
            />
            <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Adicionar')}>
                <Text style={styles.textoBotao}>(+) Incluir um item</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Baixar')}>
                <Text style={styles.textoBotao}>(-) Baixar item</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Saldo')}>
                <Text style={styles.textoBotao}>(~) Posição de Estoque</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Delete')}>
                <Text style={styles.textoBotao}>(x) Deletar um item</Text>
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
    botao: {
        backgroundColor: '#007BFF',
        width: 190,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginBottom: 15,
        padding: 10,
    },
    textoBotao: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default TelaComBotoes;
