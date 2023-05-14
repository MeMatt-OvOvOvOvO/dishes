import React from 'react';
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import  Button  from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "bootstrap/dist/css/bootstrap.min.css"
import menuu from './menu.png'

let cos = []

let App = (props) => {

  const { handleSubmit, selectedType, dispatch, reset } = props;

  const onSubmit = async (values, dispatch) => {
    // console.log(values);
  
    try {
      const response = await fetch('https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      if (response.ok) {
          response.json().then(data =>{
            console.log(data)
          })
          reset()
          cos[0] = ''

      } else {
        const data = await response.json();
        cos = Object.values(data)

        dispatch({
          type: 'POST_ERROR',
          payload: data.message,
          meta: {
            form: 'dishFormVal',
            field: '_error',
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'POST_ERROR',
        payload: 'An error occurred while submitting the form.',
        meta: {
          form: 'dishFormVal',
          field: '_error',
        },
      });
    }
  };


  const normalizeTimeField = (value) => {
    if (!value) {
      return value;
    }
  
    const onlyNums = value.replace(/[^\d]/g, '');
  
    if (onlyNums.length <= 2) {
      return onlyNums;
    }
  
    if (onlyNums.length <= 4) {
      return `${onlyNums.slice(0, 2)}:${onlyNums.slice(2)}`;
    }
  
    return `${onlyNums.slice(0, 2)}:${onlyNums.slice(2, 4)}:${onlyNums.slice(4, 6)}`;
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === 'pizza') {
      dispatch(change('dishFormVal', 'spiciness_scale', ''));
      dispatch(change('dishFormVal', 'slices_of_bread', ''));
    }
    if (selectedValue === 'soup') {
      dispatch(change('dishFormVal', 'no_of_slices', ''));
      dispatch(change('dishFormVal', 'diameter', ''));
      dispatch(change('dishFormVal', 'slices_of_bread', ''));
    }
    if (selectedValue === 'sandwich') {
      dispatch(change('dishFormVal', 'no_of_slices', ''));
      dispatch(change('dishFormVal', 'diameter', ''));
      dispatch(change('dishFormVal', 'spiciness_scale', ''));
    }
  };

  return (
      <div className="container h-100">
          <div className="d-flex justify-content-center h-100">
              <div className="user_card shadow">
                  <div className="d-flex justify-content-center">
                      <div className="brand_logo_container">
                          <img src={menuu} className="brand_logo" alt="Logo" />
                      </div>
                  </div>
                  <div className="d-flex justify-content-center form_container">

                    <Form id='dishformm' onSubmit={handleSubmit(onSubmit)}>
                      <div>
                        <div>
                          <label htmlFor="name" className='textshadow'>Dish name: </label>
                          <Field name="name" className="form-control shadow" component="input" type="text" placeholder="Dish name(3 chars)" required />
                        </div>

                        <div>
                          <label htmlFor="preparation_time" className='textshadow'>Preparation time: </label>
                          <Field name="preparation_time" className="form-control shadow" component="input" type="text" normalize={normalizeTimeField} placeholder="00:00:00" required/>
                        </div>

                        <div>
                          <label htmlFor="type" className='textshadow'>Type: </label>
                          <Field name="type" id='type' className="form-control shadow" onChange={handleSelectChange} component="select" type="text" required>
                            <option value=''>Select type</option>
                            <option value='pizza'>Pizza</option>
                            <option value='soup'>Soup</option>
                            <option value='sandwich'>Sandwich</option>
                          </Field>
                        </div>
                      </div>

                      {selectedType === 'pizza' && (
                        <div>
                          <div>
                            <label htmlFor="no_of_slices" className='textshadow'>Number of slices: </label>
                            <Field name="no_of_slices" className="form-control shadow" id='no_of_slices' component="input" type="number" min='1' placeholder="Number of slices" required/>
                          </div>
                          <div>
                            <label htmlFor="diameter" className='textshadow'>Diameter: </label>
                            <Field name="diameter" className="form-control shadow" id='diameter' component="input" type="number" step="0.01" min="0.01" placeholder="Diameter" required/>
                          </div>
                        </div>
                      )}
                      {selectedType === 'soup' && (
                        <div>
                          <label htmlFor="spiciness_scale" className='textshadow'>Spiciness scale: </label>
                          <Field name="spiciness_scale" className="form-control shadow" id='spiciness_scale' component="input" type="number" placeholder="Spiciness scale" min='1' max='10' required />
                        </div>
                      )}
                      {selectedType === 'sandwich' && (
                        <div>
                          <label htmlFor="slices_of_bread" className='textshadow'>Slices of bread: </label>
                          <Field name="slices_of_bread" className="form-control shadow" id='slices_of_bread' component="input" type="number" min='1' placeholder="Slices of bread" required/>
                        </div>
                      )}
                      {<div className='error'>{cos[0]}</div>}
                      <Button type="submit" className='btn btn-success butek shadow'>Submit</Button>
                    </Form>


                  </div>
              </div>
          </div>
      </div>
  );
};

App = reduxForm({
  form: 'dishFormVal',
})(App);

const selector = formValueSelector('dishFormVal')


App = connect(state => {
  const selectedType = selector(state, 'type')
  return {
    selectedType,
  }
})(App)

export default App
