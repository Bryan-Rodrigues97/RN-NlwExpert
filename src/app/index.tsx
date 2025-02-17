import React, { useState,useRef } from "react";
import { View, Text, TextInput, FlatList, SectionList } from "react-native";
import { Header } from "@/components/header";
import { CategoryButton } from "@/components/category-button";
import {CATEGORIES, MENU, ProductProps} from "@/utils/data/products"
import { Product } from "@/components/product";
import { Link } from "expo-router";
import { useCartStore } from "@/stores/cart-store";

export default function Home(){
    
    const cartStore = useCartStore(); 

    const [category, setCategory] = useState(CATEGORIES[0]);    

    const sectionListRef = useRef<SectionList<ProductProps>>(null);

    const cartQtyItems = cartStore.products.reduce((total, product)=> total + product.quantity, 0);

    function handleCategorySelect(selectedCategory: string){
        setCategory(selectedCategory);

        const sectionIndex = CATEGORIES.findIndex((category)=>category===selectedCategory);

        if(sectionListRef.current){
            sectionListRef.current.scrollToLocation({
                animated: true,
                sectionIndex: sectionIndex,
                itemIndex:0
            })
        }
    }

    return(
        <View className="flex-1 mt-10">
            <Header title="Faça Seu Pedido" cartQuantity={cartQtyItems}/>

            <FlatList
            data={CATEGORIES}
            keyExtractor={(item)=>item}
            renderItem={({item})=>(
                <CategoryButton title={item} isSelected={item===category} onPress={()=>handleCategorySelect(item)}/>
            )}
            horizontal
            className="max-h-10 mt-5"
            contentContainerStyle={{gap:12, paddingHorizontal: 20}}
            showsHorizontalScrollIndicator={false}
            />

            <SectionList
                ref={sectionListRef}
                sections={MENU}
                keyExtractor={(item)=>item.id}
                stickySectionHeadersEnabled={false}
                renderSectionHeader={ ({section: {title}}) => (
                    <Text className="text-xl text-white font-heading mt-8 mb-3">{title}</Text>
                ) }  
                renderItem={({item})=>(
                    <Link href={`/product/${item.id}`} asChild>
                        <Product data={item}/>
                    </Link>
                )}  
                className="flex-1 p-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 100}}
            />
        </View>
    );
}