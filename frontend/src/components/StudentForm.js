import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function StudentForm({ courses, onAdd, initialValues, onSubmit, submitLabel }) {
  const defaults = initialValues || { name: '', course: courses[0] || '' };

  return (
    <Formik
      initialValues={defaults}
      validationSchema={Yup.object({
        name: Yup.string().required('Required'),
        course: Yup.string().required('Required')
      })}
      onSubmit={(values, { resetForm }) => {
        if(onAdd) onAdd(values);
        if(onSubmit) onSubmit(values);
        resetForm();
      }}
    >
      <Form style={{ display:'flex', gap:8 }}>
        <Field name="name" placeholder="Student Name" />
        <ErrorMessage name="name" component="div" className="error" />

        <Field as="select" name="course">
          {courses.map(c => <option key={c} value={c}>{c}</option>)}
        </Field>
        <ErrorMessage name="course" component="div" className="error" />

        <button type="submit">{submitLabel || 'Add Student'}</button>
      </Form>
    </Formik>
  );
}
