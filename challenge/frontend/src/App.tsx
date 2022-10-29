import { useState, useEffect } from "react";
import React from "react";
import { useForm } from "react-hook-form";

import Modal from "./components/Modal";
import asyncWrapper from "./lib/asyncWrapper";
import CreateBookingSection from "./components/CreateBookingSection";
import { BookingsService } from "./services/bookings";
import { Booking, BookingResponse } from "./services/types";
import IconButton from "./components/IconButton";
import { AxiosError } from "axios";
import './App.css';
import 'boxicons';

export default function App() {
  const [showCreateBookingModal, setShowCreateBookingModal] =
    useState<boolean>(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const useNewBookingForm = useForm<BookingResponse>({
    defaultValues: { date: new Date().toISOString() },
  });

  const deleteBooking = async(id:number) => {
    await asyncWrapper(BookingsService.deleteBooking(id))
      .then(res => console.log(res))
      .catch(err => console.log(err))
      .finally(() => fetchBookings())
  }

  const createNewBooking = async () => {
    const data = useNewBookingForm.getValues();

    const [res, err] = await asyncWrapper(BookingsService.createBooking(data));

    if (err) {
      console.log("Error in creating Booking");
      console.error(err);
    }

    if (res) {
      setShowCreateBookingModal(false);
      fetchBookings();
    }
    useNewBookingForm.reset();
  };
  const fetchBookings = async () => {
    const [res, err] = await asyncWrapper<BookingResponse[], AxiosError>(
      BookingsService.getBookings()
    );

    if (err) {
      console.log("Error in fetching Booking");
      console.error(err);
      throw new Error("Error in fetching Booking");
    }

    if (res) {
      // Parse string date to Date object
      const bookings = res.map((booking) => ({
        ...booking,
        date: new Date(booking.date),
        created_at: new Date(booking.created_at),
        updated_at: new Date(booking.updated_at),
      }));

      setBookings(bookings);
      
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="text-center">
      <div className="flex flex-col items-center justify-center min-h-screen space-y-3">
        <p className="text-xl font-bold">Reto Luteach</p>
        <IconButton
          onClick={() => {
            setShowCreateBookingModal(true);
          }}
        >
          Crear
        </IconButton>
        <div className=" ">
          <p>Lista de bookings:</p>
          <p className="text-xs">Hazme bonito por favor</p>
          {bookings && bookings.length > 0 ? (
            bookings.map((booking) => {
              return (
                <div className="color-background">
                  <table className="table-bookings">
                    <tr>
                      <th>Buyer</th>
                      <th>Provider</th>
                      <th>Date</th>
                      
                      <th>Duration</th>
                      <th>Action</th>
                    </tr>
                    <tr>
                      <td>{booking.buyer}</td>
                      <td>{booking.provider}</td>
                      <td>{booking.date.toDateString()}</td>
                      <td>{booking.duration} minutes</td>
                      <td>
                        <button onClick={() => deleteBooking(booking.id)}>
                        Eliminar                      
                        </button>
                      </td>
                    </tr>
                  </table>
             
                </div>
              );
            })
          ) : (
            <div className="m-5">- No hay reservas</div>
          )}
        </div>
      </div>
      <Modal open={showCreateBookingModal} setOpen={setShowCreateBookingModal}>
        <CreateBookingSection
          useNewBookingForm={useNewBookingForm}
          createNewBooking={createNewBooking}
        >
          <div>
            <p className="font-bold text-lg ">Agendar una cita</p>
          </div>
        </CreateBookingSection>
      </Modal>
    </div>
  );
}
