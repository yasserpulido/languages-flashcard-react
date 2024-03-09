import { useState } from "react";

export const useSM2Modified = () => {
  const [interval, setInterval] = useState(1);
  const [EF, setEF] = useState(2.5); // Podemos mantener el EF aunque ajustemos su cálculo
  const [repetitions, setRepetitions] = useState(0);
  const [lastReviewed, setLastReviewed] = useState(new Date());

  const update = (wordRating: number) => {
    let newEF = EF;
    let newInterval = interval;

    if (wordRating === 0) {
      // Difícil
      setRepetitions(0);
      newInterval = 1;
      // Ajustamos EF mínimamente porque la escala es más pequeña
      newEF = EF - 0.2;
    } else {
      if (wordRating === 1) {
        // Bien
        newEF = EF - 0.1; // Ajuste menor porque la palabra se recordó con algo de esfuerzo
      } else if (wordRating === 2) {
        // Fácil
        newEF = EF + 0.1;
      }

      newEF = newEF < 1.3 ? 1.3 : newEF;

      if (repetitions === 0) {
        newInterval = 1;
      } else {
        newInterval = Math.round(interval * Math.max(newEF, 1.3));
      }

      setRepetitions(repetitions + 1);
    }

    setInterval(newInterval);
    setEF(newEF);
    setLastReviewed(new Date()); // Actualizamos la fecha de la última revisión
  };

  return { interval, EF, repetitions, lastReviewed, update };
};
