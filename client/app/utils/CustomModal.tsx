import React, { FC } from "react";
import { Modal, Box } from "@mui/material";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: any;
  component: any;
  setRoute?: (route: string) => void;
  refetch?: any;
}
//  this is done by metirial ui , in this part the rendering of the   login , signup ,and the varification popup done     
const CustomModal: FC<Props> = ({
  open,
  setOpen,
  setRoute,
  component: Component,
  refetch,
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[95%] m-auto  800px:w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
        <Component setOpen={setOpen} setRoute={setRoute} refetch={refetch} />
      </Box>
    </Modal>
  );
};

export default CustomModal;
