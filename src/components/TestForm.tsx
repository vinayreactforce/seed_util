import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import {
  FormCheckboxGroup,
  FormInput,
  FormDropdown,
  FormSlider,
  FormDateTimePicker,
} from '../core/forms/FormFields';
import { Button } from '../ui';
import { TestFormInputValues, TestFormValues, formSchema } from './testFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';


const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];
const interestOptions = [
  { label: '🎨 Design', value: 'bingodesign' },
  { label: '💻 Development', value: 'dev' },
  { label: '🚀 Marketing', value: 'marketing' },
  { label: '📊 Business', value: 'business' },
  { label: '🎵 Music', value: 'music' },
  { label: '🍳 Cooking', value: 'cooking' },
  { label: '🏃‍♂️ Fitness', value: 'fitness' },
  { label: '📸 Photography', value: 'photo' },
  { label: '🎮 Gaming', value: 'gaming' },
];

export default function MyProfileScreen() {
  // 1. Initialize useForm
  const { control, handleSubmit } = useForm<TestFormInputValues, any, TestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      
    },
  });
  const onSubmit = (data: TestFormValues) => {
    console.log('Selected Data:', data);

    alert(JSON.stringify(data));
  };

  const onSubmitError = (error: any) => {
    alert(JSON.stringify(error));
  };

  

  return (
    <View style={styles.screen}>
      <View style={styles.formBody}>
        {/* 2. Use the FormRadioGroup */}

     
        {/* <FormInput label="User Email" control={control} name="email" />
        <AppDivider variant="solid" align="end" margin="small" thickness={2}/>
        <FormDateTimePicker name="date" control={control} field="date" mode="datetime"/> */}
        <FormDateTimePicker name="date" control={control} field="date" mode="date"/>
        
        <FormSlider
          name="age"
          label="Age"
          control={control}
          showValues={false}
          mode="single"
          minimumValue={0}
          maximumValue={20}
          allowDecimals={false}
          
        />

        <FormCheckboxGroup
          name="interests"
          control={control}
          title="Choose your interests:"
          options={interestOptions}
          direction="row"
        />
        <FormInput label="User Name" control={control} name="name" />
        <FormInput label="You Story" isTextArea control={control} name="story" />
        <FormDropdown
          label="Gender Identity"
          name="gender"
          control={control}
          placeholder="Select your gender"
          options={genderOptions}
        />

        <FormDropdown
          label="Interests"
          name="interests"
          control={control}
          options={interestOptions}
          hasSearch
          isMulti
        />

        {/* 4. Multi-Select Dropdown */}
      </View>
      <Button
        title="Submit"
        circular
        onPress={handleSubmit(onSubmit, onSubmitError)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  formBody: {
    flex: 1,
  },
});
