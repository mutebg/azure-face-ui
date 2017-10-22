import { h } from 'preact';

const Form = ({ title, onSubmit, fields, submitLabel = 'Submit' }) => (
	<form onSubmit={onSubmit} class="card">
		<h3>{title}</h3>
		{fields.map(field => <FormField {...field} />)}
		<button class="btn btn-primary">{submitLabel}</button>
	</form>
);

const FormField = ({ label, ...rest }) => (
	<div class="form-group row">
		<label class="col-sm-2 col-form-label">{label}:</label>
		<div class="col-sm-10">
			<input class="form-control" {...rest} />
		</div>
	</div>
);

export default Form;
