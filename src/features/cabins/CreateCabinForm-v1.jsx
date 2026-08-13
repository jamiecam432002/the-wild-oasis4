import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import FormRow from '../../ui/FormRow';

import { useForm } from 'react-hook-form';
import { createCabin } from '../../services/apiCabins';

function CreateCabinForm() {
	const queryClient = useQueryClient();
	const { register, handleSubmit, reset, getValues, formState } = useForm();
	const { errors } = formState;

	const { isLoading: isCreatingCabin, mutate } = useMutation({
		mutationFn: createCabin,
		onSuccess: () => {
			toast.success('New cabin successfully created');
			queryClient.invalidateQueries({
				queryKey: ['cabins'],
			});
			reset();
		},
		onError: (err) => {
			toast.error(err.message);
		},
	});

	function onSubmit(data) {
		mutate({ ...data, image: data.image[0] });
	}

	function onError(errors) {
		console.log(errors);
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit, onError)}>
			<FormRow label='Cabin name' error={errors?.name?.message}>
				<Input
					type='text'
					id='name'
					disabled={isCreatingCabin}
					{...register('name', {
						required: 'This field is required',
					})}
				/>
			</FormRow>

			<FormRow label='Maximum capacity' error={errors?.maxCapacity?.message}>
				<Input
					type='number'
					id='maxCapacity'
					disabled={isCreatingCabin}
					{...register('maxCapacity', {
						required: 'This field is required',
						min: {
							value: 2,
							message: 'Capacity should be at least 2',
						},
					})}
				/>
			</FormRow>

			<FormRow label='Regular price' error={errors?.regularPrice?.message}>
				<Input
					type='number'
					id='regularPrice'
					disabled={isCreatingCabin}
					{...register('regularPrice', {
						required: 'This field is required',
						min: {
							value: 99,
							message: 'Price should be at least $99 dollars',
						},
					})}
				/>
			</FormRow>

			<FormRow label='Discount' error={errors?.discount?.message}>
				<Input
					type='number'
					id='discount'
					defaultValue={0}
					disabled={isCreatingCabin}
					{...register('discount', {
						required: 'This field is required',
						validate: (value) =>
							value <= getValues().regularPrice ||
							'Discount must be less than the regular price of the cabin',
					})}
				/>
			</FormRow>

			<FormRow
				label='Description for website'
				error={errors?.description?.message}>
				<Textarea
					type='number'
					id='description'
					defaultValue=''
					disabled={isCreatingCabin}
					{...register('description', {
						required: 'This field is required',
					})}
				/>
			</FormRow>

			<FormRow label='Cabin photo'>
				<FileInput
					id='image'
					accept='image/*'
					{...register('image', {
						required: 'This field is required',
					})}
				/>
			</FormRow>

			<FormRow>
				{/* type is an HTML attribute! */}
				<Button variation='secondary' type='reset'>
					Cancel
				</Button>
				<Button disabled={isCreatingCabin}>Create cabin</Button>
			</FormRow>
		</Form>
	);
}

export default CreateCabinForm;
