import { TextInput, TextInputProps } from "react-native";
import colors from "tailwindcss/colors";

export function Input({...rest}: TextInputProps){
    return <TextInput 
            {...rest}
            multiline={true}
            textAlignVertical="top"
            placeholderTextColor={colors.slate[400]}
            className="h-32 bg-slate-800 rounded-md px-4 py-3 text-sm text-white"
            />
}