import { FormFieldConfig } from "../../core/forms/FormTypes";
import { getFormMeta } from "../../core/forms/utils/formUtil";

const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Rather not say', value: 'rather_not_say' },
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

  const canRide=[
    { label: 'Car', value: 'car' },
    { label: 'Bike', value: 'bike' },
    { label: 'Bus', value: 'bus' },
    {label:'tractors',value:'tractors'},
    {label:'none',value:'none'},
    {label:'other',value:'other'},
  ];

  const havepets=[
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  const options = [
    { label: '1 unit', value: 1 },
    { label: '2 units', value: 2 },
    { label: '5 units', value: 5 },
    { label: '10 units', value: 10 }
  ]

  // { name: 'countryId', ui: 'select', apiTarget: '/api/countries' },
  // { name: 'cityId', ui: 'asyncDropdown', apiTarget: '/api/cities', dependsOn: 'countryId' }
  /*
// This is the master config for the test form contains radio, dropdown, checkbox, text, password, number, slider,datetimepicker//
//  date, time, datetime, mobile and text area //
few values are optional and required based on the field, but 

// */
export const masterConfig: FormFieldConfig<any>[] = [
    // 1. Optional Email Iteration
    { 
      name: 'userEmail', 
      type: 'Email', 
      ui: 'text', 
      label: 'Email Address', 
      required: true 
    },
  
    { 
      name: 'gender', 
      type: 'Select', 
      ui: 'radio', 
      label: 'Gender', 
      required: false ,
      options: genderOptions,
    },
    { 
        name: 'category', 
        type: 'Select', 
        ui: 'dropdown', 
        required: true, 
        label: 'Category', 
        options: [
          { label: 'Electronics', value: 'elec' },
          { label: 'Furniture', value: 'furn' },
          
        ],
        props: {
         hasSearch: true,
        }
    },
    { 
        name: 'subCategory', 
        type: 'Select', 
        ui: 'asyncDropdown', 
        label: 'Sub Category', 
        required: true, 
        dependsOn: 'category', // Links to the parent field name
        options: [
          { label: 'Laptops', value: 'lp', parentId: 'elec' },
          { label: 'Phones', value: 'ph', parentId: 'elec' },
          { label: 'Chairs', value: 'ch', parentId: 'furn' },
        ],
      },
      { 
        name: 'subCategory2', 
        type: 'Select', 
        ui: 'asyncDropdown', 
        label: 'Sub Category 2', 
        required: true, 
        dependsOn: 'category', // Links to the parent field name
        options: [
          { label: 'Laptops', value: 'lp', parentId: 'elec' },
          { label: 'Phones', value: 'ph', parentId: 'elec' },
          { label: 'Chairs', value: 'ch', parentId: 'furn' },
        ],
      },
      
      {
        name: "id_proof",
        type: "File", // We use this in our 'switch' renderer
        ui: 'file',
        label: "ID Proof (Scan/Photo)",
        props: {
          maxFiles: 1,
          sources: ['camera', 'gallery'],
          btnText: "Take Photo",
        },
        required: true,
      },
      {
        name: "expense_receipts",
        type: "File", // We use this in our 'switch' renderer
        ui: 'file',
        label: "Expense Receipts",
        props: {
          maxFiles: 5,
          sources: ['camera', 'gallery', 'document'],
          btnText: "+ Add Receipt",
        },
        required: true,
      },
  
    // 6. MULTI-SELECT (Dropdown or Checkbox Group)
    { 
      name: 'hobbies', 
      type: 'Select', 
      ui: 'dropdown', // or 'checkbox' if you have that UI componentz
      label: 'Interests', 
      required: true, 
      options: interestOptions,   
      isMulti: true,
    },
    { 
        name: 'Quantity', 
        type: 'Select', 
        ui: 'dropdown', 
        label: 'Quantity', 
        required: true, 
        options: options.map(option => ({ label: option.label, value: option.value.toString() })),
    },
    { 
        name: 'havepets', 
        type: 'Select', 
        ui: 'radio', 
        label: 'I have pets', 
        required: true, 
        options: havepets,
      },
      { 
        name: 'petName', 
        type: 'Text', 
        ui: 'text', 
        label: 'What is your pet\'s name?', 
        required: true,
        // Logic: Only show if 'havepets' equals 'yes'
        visibleIf: { field: 'havepets', operator: 'eq', value: 'yes' } 
      },
      {
        name: 'seniorDiscount',
        type: 'Text',
        ui: 'text',
        label: 'Senior Citizen ID',
        // Logic: Only show if 'age' (from your slider) is >= 60
        visibleIf: { field: 'age', operator: 'gt', value: 59 }
      },
    { 
      name: 'canRide', 
      type: 'Select', 
      ui: 'checkbox', 
      label: 'I can ride', 
      required: true, 
      options: canRide,
      props: { isMulti: false, hasSearch: true, direction: 'row' }
    },
    { 
      name: 'recoverEmail', 
      type: 'Email', 
      ui: 'text', 
      label: 'Email Address (Recover)', 
      required: false 
    },
    // 2. Password with Secure Entry & Numeric Mode
    { 
      name: 'accountPin', 
      type: 'Password', 
      ui: 'text', 
      label: 'Security PIN', 
      required: true, 
      props: { secureTextEntry: true, mode: 'numeric', maxLength: 4 } 
    },
    // 3. TextArea Iteration (Using Multiline Props)
    { 
      name: 'personalBio', 
      type: 'Text', 
      ui: 'text', 
      label: 'Short Biography', 
      required: true, 
      props: { multiline: true, numberOfLines: 4,isTextArea: true, placeholder: 'Tell us about yourself...' } 
    },
    // 4. Date Picker Iteration
    { 
      name: 'birthDate', 
      type: 'Date', 
      ui: 'datetime', 
      label: 'Date of Birth', 
      required: true, 
      props: { mode: 'date',minAge: 10 } 
    },
    // 5. Time Picker Iteration
    { 
      name: 'preferredTime', 
      type: 'Date', // Uses Date brick but mode changes UI to time
      ui: 'datetime', 
      label: 'Preferred Contact Time', 
      required: false, 
      props: { mode: 'time' } 
    },
    { 
      name: 'timestamp', 
      type: 'Date', // Uses Date brick but mode changes UI to time
      ui: 'datetime', 
      label: 'Signature Datetime', 
      required: true, 
      props: { mode: 'datetime' } 
    },
    // 6. Mobile Brick Iteration
    {
      name: 'phoneNumber',
      type: 'Mobile',
      ui: 'text',
      label: 'Mobile Number',
      required: true,
      props: { keyboardType: 'phone-pad' }
    },
    // 7. Coerced Number Brick Iteration
    {
      name: 'age',
      type: 'Number',
      ui: 'slider',
      label: 'Current Age',
      required: true,
      props: { minimumValue: 0, maximumValue: 100, mode:"single" as const, allowDecimals: false }
    }
];


  export const { defaultValues } = getFormMeta<typeof masterConfig>(masterConfig);
