import { createToaster } from '@meforma/vue-toaster';

export function useToastr(position = 'top-right') {
  const toaster = createToaster({
    position
  });

  const success = (msg = 'Operation done succesfully!! C:') => toaster.success(msg);
  const error = (msg = 'Ops! An error has ocurred! :C') => toaster.error(msg);

  return {
    success, error
  }
}
