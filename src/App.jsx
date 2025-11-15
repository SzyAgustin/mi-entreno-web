import { useState, useEffect } from 'react';
import './App.css';

// Componente de Calendario Web
const WebCalendar = ({ markedDates, onDayPress }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };
  
  const formatDateString = (year, month, day) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };
  
  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };
  
  const renderDays = () => {
    const days = [];
    const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    
    // Días vacíos antes del primer día del mes
    for (let i = 0; i < adjustedStartDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateString(year, month, day);
      const dayData = markedDates[dateString];
      const today = new Date();
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
      
      days.push(
        <button
          key={day}
          className={`calendar-day ${dayData ? 'has-training' : ''} ${isToday && !dayData ? 'today' : ''}`}
          style={dayData ? {
            backgroundColor: dayData.color,
            opacity: dayData.isRestWeek ? 0.5 : 1,
            transform: dayData.isCompleted ? 'scale(1.1)' : 'scale(1)'
          } : {}}
          onClick={() => onDayPress({ dateString })}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };
  
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={goToPreviousMonth} className="calendar-arrow">
          ←
        </button>
        <h2 className="calendar-month">
          {monthNames[month]} {year}
        </h2>
        <button onClick={goToNextMonth} className="calendar-arrow">
          →
        </button>
      </div>
      
      <div className="calendar-day-names">
        {dayNames.map(name => (
          <div key={name} className="calendar-day-name">{name}</div>
        ))}
      </div>
      
      <div className="calendar-grid">
        {renderDays()}
      </div>
    </div>
  );
};

function App() {
  const [currentScreen, setCurrentScreen] = useState('Calendar');
  const [selectedDate, setSelectedDate] = useState(null);
  const [completedDays, setCompletedDays] = useState(() => {
    try {
      const saved = localStorage.getItem('completedDays');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Error loading data:', e);
      return {};
    }
  });

  // Guardar en localStorage cuando cambien los días completados
  useEffect(() => {
    try {
      localStorage.setItem('completedDays', JSON.stringify(completedDays));
    } catch (e) {
      console.error('Error saving data:', e);
    }
  }, [completedDays]);

  // Funciones auxiliares para manejo de fechas
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  // Datos base de entrenamiento
  const baseTrainingData = {
    1: { // Lunes
      name: 'Lunes',
      category: 'Pecho y Tríceps',
      color: '#ff6b35',
      exercises: [
        { name: 'Plano', times: 1, baseReps: 10, baseWeight: 20 },
        { name: 'Inclinado', times: 1, baseReps: 10, baseWeight: 16 },
        { name: 'Apertura plana', times: 1, baseReps: 10, baseWeight: 10 },
        { name: 'Apertura inclinada', times: 1, baseReps: 10, baseWeight: 10 },
        { name: 'Tríceps polea', times: 1, baseReps: 10, baseWeight: 15 },
        { name: 'Tríceps arriba cabeza', times: 1, baseReps: 10, baseWeight: 6 },
      ]
    },
    2: { // Martes
      name: 'Martes',
      category: 'Cardio',
      color: '#FFC107',
      exercises: [
        { name: 'Caminar', times: 1, baseReps: '40 min', baseWeight: '-' },
      ]
    },
    3: { // Miércoles
      name: 'Miércoles',
      category: 'Pierna y Hombros',
      color: '#9C27B0',
      exercises: [
        { name: 'Prensa', times: 1, baseReps: 10, baseWeight: 40 },
        { name: 'Cuádriceps', times: 1, baseReps: 10, baseWeight: 40 },
        { name: 'Tríceps', times: 1, baseReps: 10, baseWeight: 40 },
        { name: 'Gemelos', times: 1, baseReps: 15, baseWeight: 40 },
        { name: 'Laterales', times: 1, baseReps: 10, baseWeight: 8 },
        { name: 'Militares', times: 1, baseReps: 10, baseWeight: 12 },
        { name: 'Face pull', times: 1, baseReps: 10, baseWeight: 15 },
      ]
    },
    4: { // Jueves
      name: 'Jueves',
      category: 'Cardio',
      color: '#FFC107',
      exercises: [
        { name: 'Caminar', times: 1, baseReps: '40 min', baseWeight: '-' },
      ]
    },
    5: { // Viernes
      name: 'Viernes',
      category: 'Espalda y Bíceps',
      color: '#2196F3',
      exercises: [
        { name: 'Pull ups', times: 1, baseReps: 10, baseWeight: 45 },
        { name: 'Remo', times: 1, baseReps: 10, baseWeight: 45 },
        { name: 'Pull c/ bíceps', times: 1, baseReps: 10, baseWeight: 45 },
        { name: 'Tirón abajo', times: 1, baseReps: 10, baseWeight: 45 },
        { name: 'Martillo', times: 1, baseReps: 10, baseWeight: 8 },
        { name: 'Bíceps prona', times: 1, baseReps: 10, baseWeight: 8 },
        { name: 'Bíceps sentado', times: 1, baseReps: 10, baseWeight: 8 },
      ]
    },
    6: { // Sábado
      name: 'Sábado',
      category: 'Cardio',
      color: '#FFC107',
      exercises: [
        { name: 'Caminar', times: 1, baseReps: '40 min', baseWeight: '-' },
      ]
    }
  };

  // Función para calcular el número de semana en el ciclo
  const getWeekInCycle = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let daysUntilMonday = (1 - today.getDay() + 7) % 7;
    if (daysUntilMonday === 0 && today.getDay() !== 1) {
      daysUntilMonday = 7;
    }
    
    const startMonday = new Date(today);
    startMonday.setDate(today.getDate() + daysUntilMonday);
    startMonday.setHours(0, 0, 0, 0);
    
    const targetDate = parseDate(dateString);
    
    const diffTime = targetDate.getTime() - startMonday.getTime();
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    let weekInCycle = (diffWeeks % 5) + 1;
    if (weekInCycle < 1) {
      weekInCycle = ((diffWeeks % 5) + 5) + 1;
    }
    
    return weekInCycle;
  };

  // Función para calcular la semana absoluta
  const getAbsoluteWeek = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let daysUntilMonday = (1 - today.getDay() + 7) % 7;
    if (daysUntilMonday === 0 && today.getDay() !== 1) {
      daysUntilMonday = 7;
    }
    
    const startMonday = new Date(today);
    startMonday.setDate(today.getDate() + daysUntilMonday);
    startMonday.setHours(0, 0, 0, 0);
    
    const targetDate = parseDate(dateString);
    
    const diffTime = targetDate.getTime() - startMonday.getTime();
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    return diffWeeks + 1;
  };

  // Calcular las "veces" según la semana absoluta
  const calculateTimes = (absoluteWeek) => {
    if (absoluteWeek <= 2) {
      return 1;
    } else if (absoluteWeek <= 4) {
      return 2;
    } else if (absoluteWeek === 5) {
      return 1;
    } else {
      return 3;
    }
  };

  // Calcular peso y reps según la semana
  const calculateExerciseData = (exercise, weekInCycle, absoluteWeek) => {
    if (exercise.baseWeight === '-') {
      return {
        reps: exercise.baseReps,
        lastWeight: '-',
        todayWeight: '-'
      };
    }

    const completedCycles = Math.floor((absoluteWeek - 1) / 5);
    const adjustedBaseWeight = exercise.baseWeight + (completedCycles * 2);

    let reps, todayWeight, lastWeight;

    if (weekInCycle === 5) {
      reps = Math.round(exercise.baseReps * 0.7);
      todayWeight = Math.round(adjustedBaseWeight * 0.7);
      lastWeight = adjustedBaseWeight + ((4 - 1) * 2);
    } else {
      const weeksProgressed = weekInCycle - 1;
      todayWeight = adjustedBaseWeight + (weeksProgressed * 2);
      reps = exercise.baseReps - weeksProgressed;
      
      if (weekInCycle === 1) {
        if (absoluteWeek === 1) {
          lastWeight = 'X';
        } else {
          const previousCycleBaseWeight = exercise.baseWeight + ((completedCycles - 1) * 2);
          lastWeight = previousCycleBaseWeight + ((4 - 1) * 2);
        }
      } else {
        lastWeight = adjustedBaseWeight + ((weekInCycle - 2) * 2);
      }
    }

    return { reps, lastWeight, todayWeight };
  };

  // Generar datos de entrenamiento para una fecha
  const getTrainingDataForDate = (dateString, dayOfWeek) => {
    const weekInCycle = getWeekInCycle(dateString);
    const absoluteWeek = getAbsoluteWeek(dateString);
    const baseData = baseTrainingData[dayOfWeek];
    
    const exercises = baseData.exercises.map(exercise => {
      const { reps, lastWeight, todayWeight } = calculateExerciseData(exercise, weekInCycle, absoluteWeek);
      const times = calculateTimes(absoluteWeek);
      return {
        name: exercise.name,
        times: times,
        reps: reps,
        lastWeight: lastWeight,
        todayWeight: todayWeight
      };
    });

    return {
      ...baseData,
      exercises,
      weekInCycle
    };
  };

  // Obtener todos los días de entrenamiento
  const getTrainingDays = () => {
    const days = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    nextMonday.setHours(0, 0, 0, 0);
    
    const julyEnd = new Date(2026, 6, 31);
    const diffTime = julyEnd.getTime() - nextMonday.getTime();
    const totalWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1;
    
    for (let i = 0; i < totalWeeks; i++) {
      for (let dayOfWeek = 1; dayOfWeek <= 6; dayOfWeek++) {
        const date = new Date(nextMonday);
        date.setDate(nextMonday.getDate() + (i * 7) + (dayOfWeek - 1));
        date.setHours(0, 0, 0, 0);
        
        const dateString = formatDate(date);
        const isCompleted = completedDays[dateString];
        const weekInCycle = getWeekInCycle(dateString);
        const isRestWeek = weekInCycle === 5;
        
        const color = isCompleted ? '#27F538' : baseTrainingData[dayOfWeek].color;
        
        days[dateString] = {
          dayOfWeek: dayOfWeek,
          isRestWeek: isRestWeek,
          color: color,
          isCompleted: isCompleted
        };
      }
    }
    
    return days;
  };

  const markedDates = getTrainingDays();

  // Calcular progreso del mes
  const getMonthProgress = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    let totalDays = 0;
    let completedDaysCount = 0;
    
    Object.keys(markedDates).forEach(dateString => {
      const date = new Date(dateString);
      if (date.getFullYear() === year && date.getMonth() === month) {
        totalDays++;
        if (completedDays[dateString]) {
          completedDaysCount++;
        }
      }
    });
    
    return { total: totalDays, completed: completedDaysCount };
  };

  const monthProgress = getMonthProgress();
  const progressPercentage = monthProgress.total > 0 
    ? Math.round((monthProgress.completed / monthProgress.total) * 100) 
    : 0;

  const toggleCompleted = () => {
    const dateKey = selectedDate?.date;
    if (dateKey) {
      setCompletedDays(prev => ({
        ...prev,
        [dateKey]: !prev[dateKey]
      }));
    }
  };

  const onDayPress = (day) => {
    if (markedDates[day.dateString]) {
      const dayOfWeek = markedDates[day.dateString].dayOfWeek;
      const trainingData = getTrainingDataForDate(day.dateString, dayOfWeek);
      setSelectedDate({
        date: day.dateString,
        dayOfWeek: dayOfWeek,
        data: trainingData
      });
      setCurrentScreen('WorkoutDetail');
    }
  };

  const goBack = () => {
    setCurrentScreen('Calendar');
    setSelectedDate(null);
  };

  // Pantalla de Calendario
  if (currentScreen === 'Calendar') {
    return (
      <div className="app">
        <header className="header">
          <h1 className="title">Mi Calendario</h1>
          <p className="subtitle">Selecciona un día para ver tu rutina</p>
        </header>

        {/* Banner de progreso mensual */}
        <div className="progress-banner">
          <div className="progress-header">
            <h3 className="progress-title">Progreso del Mes</h3>
            <span className="progress-percentage">{progressPercentage}%</span>
          </div>
          
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }} />
          </div>
          
          <div className="progress-stats">
            <div className="progress-stat">
              <div className="progress-stat-number">{monthProgress.completed}</div>
              <div className="progress-stat-label">Completados</div>
            </div>
            <div className="progress-stat-divider" />
            <div className="progress-stat">
              <div className="progress-stat-number">{monthProgress.total}</div>
              <div className="progress-stat-label">Total del mes</div>
            </div>
          </div>
        </div>

        <WebCalendar
          markedDates={markedDates}
          onDayPress={onDayPress}
        />

        <div className="legend-container">
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#ff6b35' }} />
            <span className="legend-text">Pecho y Tríceps</span>
          </div>
          
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#9C27B0' }} />
            <span className="legend-text">Pierna y Hombros</span>
          </div>
          
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#2196F3' }} />
            <span className="legend-text">Espalda y Bíceps</span>
          </div>
          
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#FFC107' }} />
            <span className="legend-text">Cardio</span>
          </div>

          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#27F538' }} />
            <span className="legend-text">Día Completado</span>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de Detalle
  const currentData = selectedDate?.data;
  const isCompleted = completedDays[selectedDate?.date];

  return (
    <div className="app">
      <header className="header detail-header" style={{ borderBottomColor: currentData?.color }}>
        <button onClick={goBack} className="back-button" style={{ color: currentData?.color }}>
          ← Volver
        </button>
        
        <div className="title-row">
          <h1 className="day-title">{currentData?.name || 'Día'}</h1>
          {currentData?.weekInCycle && (
            <span className={`week-badge ${currentData.weekInCycle === 5 ? 'rest' : ''}`}>
              {currentData.weekInCycle === 5 ? 'Descanso' : `Semana ${currentData.weekInCycle}`}
            </span>
          )}
        </div>
        
        <h2 className="category-title" style={{ color: currentData?.color }}>
          {currentData?.category || ''}
        </h2>
        {selectedDate?.date && <p className="date-text">{selectedDate.date}</p>}
      </header>

      <div className="scroll-view">
        <div className="exercises-list">
          {currentData?.exercises.map((exercise, index) => (
            <div key={index} className="exercise-card" style={{ borderColor: currentData.color }}>
              <h3 className="exercise-name">{exercise.name}</h3>
              
              <div className="exercise-details">
                <div className="detail-item">
                  <span className="detail-label">Veces</span>
                  <span className="detail-value">{exercise.times}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Reps</span>
                  <span className="detail-value">{exercise.reps}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Último Peso</span>
                  <span className="detail-value">{exercise.lastWeight}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Peso Hoy</span>
                  <span className="detail-value-highlight" style={{ color: currentData.color }}>
                    {typeof exercise.todayWeight === 'number' ? `${exercise.todayWeight} kg` : exercise.todayWeight}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer" style={{ borderTopColor: currentData?.color }}>
        <button 
          className={`complete-button ${isCompleted ? 'completed' : ''}`}
          onClick={toggleCompleted}
        >
          {isCompleted ? '✓ Completado' : '✓ Marcar como Completado'}
        </button>
      </footer>
      </div>
  );
}

export default App;
