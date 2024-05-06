import { Header } from "@/components/header";
import { View, Text, ScrollView, Alert, Linking } from "react-native";
import { Product } from "@/components/product";
import { ProductCartProps, useCartStore } from "@/stores/cart-store";
import { LinkButton } from "@/components/link-button";
import { formatCurrency } from "@/utils/functions/formatCurrency";
import { Input } from "@/components/input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "@/components/button";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { add } from "@/stores/helpers/cart-in-memory";
import { useNavigation } from "expo-router";

export default function Cart(){
    const [address, setAdress] = useState("");
    const cartStore = useCartStore();
    const total = formatCurrency(cartStore.products.reduce((acc,current) => acc + (current.price*current.quantity),0));
    const nav = useNavigation();

    function handleProductRemove(product: ProductCartProps){
        Alert.alert("Remover",`Deseja remover o produto ${product.title} do carrinho?`,[
            {
                text:"Cancelar"
            },
            {
                text:"Remover",
                onPress: () => cartStore.remove(product.id)
            }
        ]);
    }

    function handleOrder(){
        if(address.trim().length === 0){
            return Alert.alert("Pedido","Informe o endereço de entrega");
        }
        
        const products = cartStore.products.map((product) => 
            `\n ${product.quantity} - ${product.title}`)
            .join('');

        const message = `
NOVO PEDIDO
\nEntregar em ${address}

${products}

\nValor Total: ${total}
`

        Linking.openURL(`http://api.whatsapp.com/send?phone=${5551993592838}&text=${message}`);

        cartStore.clear();
        nav.goBack();
    }

    return(
        <View className="flex-1 pt-8">
            <Header title="Seu Carrinho"/>
            <KeyboardAwareScrollView>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="flex-1 p-5">
                    {
                        cartStore.products.length > 0 ?
                        <View className="border-b border-slate-700">
                        {
                            cartStore.products.map((product) => (
                                <Product 
                                key={product.id} 
                                data={product} 
                                onPress={()=>handleProductRemove(product)}
                                />
                                ))
                        }
                        </View>
                    :
                        <Text className="font=body text-slate-400 text-center my-8">
                            Seu Carrinho está vazio.  
                        </Text>
                    }

                        <View className="flex-row gap-2 items-center mt-5 mb-4">
                            <Text className="text-white text-xl font-subtitle">Total:</Text>
                            <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
                        </View>

                        <Input 
                        placeholder="Informe o Endereço de entrega com rua, número, bairro, cidade, referência" 
                        value={address}
                        onChangeText={setAdress} 
                        blurOnSubmit={true}
                        returnKeyType="next"
                        />
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>
            <View className="p-5 pb-3 gap-5">
                <Button onPress={handleOrder}>
                    <Button.Text>Enviar Pedido</Button.Text>
                    <Button.Icon>
                        <Feather name="arrow-right-circle" size={20}/>
                    </Button.Icon>
                </Button>
                <LinkButton title="Voltar ao Cardápio" href="/"/>
            </View>
        </View>
    )
}