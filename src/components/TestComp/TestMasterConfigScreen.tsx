import React from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { useAppForm } from '../../core/forms/useAppForm';
import { FormEngine } from '../../core/forms/FormEngine';
import { defaultValues, masterConfig } from './testConfig';
import { Button } from '../../ui';
import { FilePicker } from '../../ui/FilePicker';

  
export type IMasterRegistration = typeof defaultValues;
// Configuration catering to ALL specialized components and bricks


 const MasterRegistrationScreen = () => {
  // useAppForm orchestrates the Zod Schema + Hook Form state
  const formMethods = useAppForm<IMasterRegistration>({
    config: masterConfig,
    defaultValues
  });
  const { control, handleSmartSubmit, formState: { isSubmitting } } = formMethods;
  const onSubmit = (data: IMasterRegistration) => {

    console.log("Form Validated!", JSON.stringify(data));
    Alert.alert("Form Validated!", JSON.stringify(data, null, 2));
  };
  const handleSubmitError = (error: any) => {
    console.log("Form Validation Error!", JSON.stringify(error));
    Alert.alert("Form Validation Error!", JSON.stringify(error, null, 2));
  };
  return (
    <View style={{flex:1,marginHorizontal:10}}> 
    <View style={{marginTop:40}}>

    <FilePicker
      files={[]}
      onFilesChange={()=>{}}
      sources={["camera"]}
      btnText="Take Photo"
    />
    </View>
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* FormEngine loops through config and maps to components */}
      <FormEngine 
        config={masterConfig} 
        control={control} 
        setValue={formMethods.setValue}
      />

    
    </ScrollView>
    <Button 
          title={isSubmitting ? "Processing..." : "Submit Form"} 
          onPress={handleSmartSubmit(onSubmit,handleSubmitError)} 
          isDisabled={isSubmitting}
          btnContainerStyle={{marginHorizontal:10}}
        />
        <View  style={{height:20}} />
    </View>
  );
};



export default MasterRegistrationScreen;