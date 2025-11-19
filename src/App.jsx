import { useState, useEffect, useRef } from 'react';
import './App.css';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Componente de Tarjeta de Ejercicio con Long Press
const ExerciseCard = ({ exercise, index, color, onLongPress, onWeightLongPress }) => {
  const [isPressingName, setIsPressingName] = useState(false);
  const [isPressingWeight, setIsPressingWeight] = useState(false);
  const nameLongPressTimer = useRef(null);
  const weightLongPressTimer = useRef(null);

  // Handlers para el nombre
  const handleNameTouchStart = () => {
    setIsPressingName(true);
    nameLongPressTimer.current = setTimeout(() => {
      onLongPress(exercise, index);
      setIsPressingName(false);
    }, 800);
  };

  const handleNameTouchEnd = () => {
    setIsPressingName(false);
    if (nameLongPressTimer.current) {
      clearTimeout(nameLongPressTimer.current);
    }
  };

  const handleNameMouseDown = () => {
    setIsPressingName(true);
    nameLongPressTimer.current = setTimeout(() => {
      onLongPress(exercise, index);
      setIsPressingName(false);
    }, 800);
  };

  const handleNameMouseUp = () => {
    setIsPressingName(false);
    if (nameLongPressTimer.current) {
      clearTimeout(nameLongPressTimer.current);
    }
  };

  const handleNameMouseLeave = () => {
    setIsPressingName(false);
    if (nameLongPressTimer.current) {
      clearTimeout(nameLongPressTimer.current);
    }
  };

  // Handlers para el peso
  const handleWeightTouchStart = () => {
    if (exercise.todayWeight === '-' || typeof exercise.todayWeight !== 'number') return;
    setIsPressingWeight(true);
    weightLongPressTimer.current = setTimeout(() => {
      onWeightLongPress(exercise, index);
      setIsPressingWeight(false);
    }, 800);
  };

  const handleWeightTouchEnd = () => {
    setIsPressingWeight(false);
    if (weightLongPressTimer.current) {
      clearTimeout(weightLongPressTimer.current);
    }
  };

  const handleWeightMouseDown = () => {
    if (exercise.todayWeight === '-' || typeof exercise.todayWeight !== 'number') return;
    setIsPressingWeight(true);
    weightLongPressTimer.current = setTimeout(() => {
      onWeightLongPress(exercise, index);
      setIsPressingWeight(false);
    }, 800);
  };

  const handleWeightMouseUp = () => {
    setIsPressingWeight(false);
    if (weightLongPressTimer.current) {
      clearTimeout(weightLongPressTimer.current);
    }
  };

  const handleWeightMouseLeave = () => {
    setIsPressingWeight(false);
    if (weightLongPressTimer.current) {
      clearTimeout(weightLongPressTimer.current);
    }
  };

  return (
    <div className="exercise-card" style={{ borderColor: color }}>
      <h3 
        className={`exercise-name ${isPressingName ? 'pressing' : ''}`}
        onTouchStart={handleNameTouchStart}
        onTouchEnd={handleNameTouchEnd}
        onMouseDown={handleNameMouseDown}
        onMouseUp={handleNameMouseUp}
        onMouseLeave={handleNameMouseLeave}
      >
        {exercise.name}
      </h3>
      
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
          <span 
            className={`detail-value-highlight ${isPressingWeight ? 'pressing' : ''} ${typeof exercise.todayWeight === 'number' ? 'editable' : ''}`}
            style={{ color: color }}
            onTouchStart={handleWeightTouchStart}
            onTouchEnd={handleWeightTouchEnd}
            onMouseDown={handleWeightMouseDown}
            onMouseUp={handleWeightMouseUp}
            onMouseLeave={handleWeightMouseLeave}
          >
            {typeof exercise.todayWeight === 'number' ? `${exercise.todayWeight} kg` : exercise.todayWeight}
          </span>
        </div>
      </div>
    </div>
  );
};

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
  const [completedDays, setCompletedDays] = useState({});
  const [customExerciseNames, setCustomExerciseNames] = useState({});
  const [customWeights, setCustomWeights] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingExercise, setEditingExercise] = useState(null);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [editingWeight, setEditingWeight] = useState(null);
  const [newWeight, setNewWeight] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Cargar datos desde Firestore al iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔥 Intentando conectar a Firebase...');
        console.log('📝 Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
        
        const docRef = doc(db, 'completedDays', 'user_default');
        
        // Timeout de 10 segundos
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout: La conexión tardó demasiado')), 10000)
        );
        
        const docSnap = await Promise.race([
          getDoc(docRef),
          timeoutPromise
        ]);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCompletedDays(data.days || {});
          setCustomExerciseNames(data.customExerciseNames || {});
          setCustomWeights(data.customWeights || {});
          console.log('✅ Datos cargados desde Firebase exitosamente');
        } else {
          console.log('📭 No hay datos en Firebase, iniciando con datos vacíos');
          setCompletedDays({});
          setCustomExerciseNames({});
          setCustomWeights({});
        }
        setIsLoading(false);
        setError(null);
      } catch (e) {
        console.error('❌ Error al cargar desde Firebase:', e);
        console.error('Detalles del error:', e.code, e.message);
        setError({
          message: 'No se pudo conectar a Firebase',
          details: e.message || 'Verifica tu conexión a internet y las reglas de Firestore'
        });
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Guardar en Firestore cuando cambien los días completados, nombres o pesos personalizados
  useEffect(() => {
    if (isLoading || error) return; // No guardar si hay error o está cargando

    const saveData = async () => {
      try {
        const docRef = doc(db, 'completedDays', 'user_default');
        await setDoc(docRef, { 
          days: completedDays,
          customExerciseNames: customExerciseNames,
          customWeights: customWeights
        });
        console.log('✅ Datos guardados en Firebase');
      } catch (e) {
        console.error('❌ Error al guardar en Firebase:', e);
        setError({
          message: 'No se pudo guardar en Firebase',
          details: e.message
        });
      }
    };

    saveData();
  }, [completedDays, customExerciseNames, customWeights, isLoading, error]);

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
        { name: 'Triceps acostado', times: 1, baseReps: 10, baseWeight: 6 },
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
    // Fecha fija de inicio: lunes 17 de noviembre de 2025
    const startMonday = new Date(2025, 10, 17); // Mes 10 = noviembre (0-indexed)
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
    // Fecha fija de inicio: lunes 17 de noviembre de 2025
    const startMonday = new Date(2025, 10, 17); // Mes 10 = noviembre (0-indexed)
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

  // Obtener peso base personalizado para un ejercicio y fecha
  const getCustomBaseWeight = (dayOfWeek, originalName, dateString, customWeightsOverride = null) => {
    const key = `${dayOfWeek}-${originalName}`;
    const weightsSource = customWeightsOverride || customWeights;
    const customWeightEntries = weightsSource[key] || [];
    
    // Filtrar los pesos que se aplicaron antes o en la fecha especificada
    const applicableWeights = customWeightEntries.filter(item => item.fromDate <= dateString);
    
    if (applicableWeights.length > 0) {
      // Retornar el más reciente
      const sortedWeights = applicableWeights.sort((a, b) => b.fromDate.localeCompare(a.fromDate));
      return {
        customWeight: sortedWeights[0].weight,
        fromDate: sortedWeights[0].fromDate,
        fromAbsoluteWeek: sortedWeights[0].absoluteWeek
      };
    }
    
    return null;
  };

  // Calcular peso y reps según la semana
  const calculateExerciseData = (exercise, weekInCycle, absoluteWeek, dateString, dayOfWeek, customWeightsOverride = null) => {
    if (exercise.baseWeight === '-') {
      return {
        reps: exercise.baseReps,
        lastWeight: '-',
        todayWeight: '-'
      };
    }

    // Verificar si hay un peso personalizado
    const customWeightData = getCustomBaseWeight(dayOfWeek, exercise.name, dateString, customWeightsOverride);
    
    let baseWeightToUse = exercise.baseWeight;
    let adjustedBaseWeight;
    
    if (customWeightData) {
      // Usar el peso personalizado como nuevo peso base desde esa fecha
      const weeksSinceCustom = absoluteWeek - customWeightData.fromAbsoluteWeek;
      const cyclesSinceCustom = Math.floor(weeksSinceCustom / 5);
      baseWeightToUse = customWeightData.customWeight;
      adjustedBaseWeight = baseWeightToUse + (cyclesSinceCustom * 2);
    } else {
      // Usar la progresión normal desde el peso base original
      const completedCycles = Math.floor((absoluteWeek - 1) / 5);
      adjustedBaseWeight = baseWeightToUse + (completedCycles * 2);
    }

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
          // Calcular el peso base del ciclo anterior
          let previousCycleBaseWeight;
          if (customWeightData && absoluteWeek - 1 >= customWeightData.fromAbsoluteWeek) {
            const weeksSinceCustom = (absoluteWeek - 1) - customWeightData.fromAbsoluteWeek;
            const cyclesSinceCustom = Math.floor(weeksSinceCustom / 5);
            previousCycleBaseWeight = customWeightData.customWeight + (cyclesSinceCustom * 2);
          } else {
            const completedCycles = Math.floor((absoluteWeek - 1 - 1) / 5);
            previousCycleBaseWeight = exercise.baseWeight + (completedCycles * 2);
          }
          lastWeight = previousCycleBaseWeight + ((4 - 1) * 2);
        }
      } else {
        lastWeight = adjustedBaseWeight + ((weekInCycle - 2) * 2);
      }
    }

    return { reps, lastWeight, todayWeight };
  };

  // Obtener nombre personalizado de ejercicio o nombre por defecto
  const getExerciseName = (dayOfWeek, originalName, fromDate, customNamesOverride = null) => {
    // Buscar el nombre personalizado más reciente para ese ejercicio y día de la semana
    const key = `${dayOfWeek}-${originalName}`;
    const namesSource = customNamesOverride || customExerciseNames;
    const customNames = namesSource[key] || [];
    
    console.log('🔍 Buscando nombre para:', {
      key,
      fromDate,
      availableNames: customNames,
      usingOverride: customNamesOverride !== null
    });
    
    // Filtrar los nombres que se aplicaron antes o en la fecha especificada
    const applicableNames = customNames.filter(item => item.fromDate <= fromDate);
    
    console.log('✅ Nombres aplicables:', applicableNames);
    
    // Si hay nombres aplicables, retornar el más reciente
    if (applicableNames.length > 0) {
      const sortedNames = applicableNames.sort((a, b) => b.fromDate.localeCompare(a.fromDate));
      const selectedName = sortedNames[0].customName;
      console.log('📝 Nombre seleccionado:', selectedName);
      return selectedName;
    }
    
    console.log('📝 Usando nombre original:', originalName);
    return originalName;
  };

  // Generar datos de entrenamiento para una fecha
  const getTrainingDataForDate = (dateString, dayOfWeek, customNamesOverride = null, customWeightsOverride = null) => {
    const weekInCycle = getWeekInCycle(dateString);
    const absoluteWeek = getAbsoluteWeek(dateString);
    const baseData = baseTrainingData[dayOfWeek];
    
    const exercises = baseData.exercises.map(exercise => {
      const { reps, lastWeight, todayWeight } = calculateExerciseData(
        exercise, 
        weekInCycle, 
        absoluteWeek, 
        dateString, 
        dayOfWeek, 
        customWeightsOverride
      );
      const times = calculateTimes(absoluteWeek);
      const customName = getExerciseName(dayOfWeek, exercise.name, dateString, customNamesOverride);
      
      return {
        name: customName,
        originalName: exercise.name,
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
    
    // Fecha fija de inicio: lunes 17 de noviembre de 2025
    const nextMonday = new Date(2025, 10, 17); // Mes 10 = noviembre (0-indexed)
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
      // Agregar entrada al historial del navegador
      window.history.pushState({ screen: 'WorkoutDetail' }, '', '');
    }
  };

  const goBack = () => {
    setCurrentScreen('Calendar');
    setSelectedDate(null);
  };

  // Manejar long press en nombre de ejercicio
  const handleLongPress = (exercise, index) => {
    setEditingExercise({ 
      exercise, 
      index,
      dayOfWeek: selectedDate?.dayOfWeek,
      date: selectedDate?.date
    });
    setNewExerciseName(exercise.name);
  };

  // Mostrar mensaje toast
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  // Guardar nombre personalizado de ejercicio
  const saveCustomExerciseName = () => {
    if (!editingExercise || !newExerciseName.trim()) {
      setEditingExercise(null);
      return;
    }

    const { exercise, dayOfWeek, date } = editingExercise;
    const originalName = exercise.originalName || exercise.name;
    const key = `${dayOfWeek}-${originalName}`;

    // Obtener las entradas existentes y filtrar cualquier entrada con la misma fecha
    const existingNames = customExerciseNames[key] || [];
    const filteredNames = existingNames.filter(item => item.fromDate !== date);

    // Crear el objeto actualizado con el nuevo nombre personalizado
    const updatedCustomNames = {
      ...customExerciseNames,
      [key]: [
        ...filteredNames,
        {
          customName: newExerciseName.trim(),
          fromDate: date
        }
      ]
    };

    console.log('💾 Guardando nombre personalizado:', {
      key,
      date,
      newName: newExerciseName.trim(),
      allNames: updatedCustomNames[key]
    });

    // Actualizar el estado
    setCustomExerciseNames(updatedCustomNames);

    // Recargar los datos del día actual con los nombres actualizados INMEDIATAMENTE
    const trainingData = getTrainingDataForDate(date, dayOfWeek, updatedCustomNames);
    setSelectedDate({
      date: date,
      dayOfWeek: dayOfWeek,
      data: trainingData
    });

    // Cerrar el modal y mostrar confirmación
    setEditingExercise(null);
    setNewExerciseName('');
    showToastMessage('✓ Nombre actualizado correctamente');
  };

  // Cancelar edición
  const cancelEdit = () => {
    setEditingExercise(null);
    setNewExerciseName('');
  };

  // Manejar long press en peso
  const handleWeightLongPress = (exercise, index) => {
    // Solo permitir edición si el peso no es '-'
    if (exercise.todayWeight === '-' || typeof exercise.todayWeight !== 'number') {
      return;
    }
    
    setEditingWeight({ 
      exercise, 
      index,
      dayOfWeek: selectedDate?.dayOfWeek,
      date: selectedDate?.date
    });
    setNewWeight(exercise.todayWeight.toString());
  };

  // Guardar peso personalizado
  const saveCustomWeight = () => {
    if (!editingWeight || !newWeight.trim()) {
      setEditingWeight(null);
      return;
    }

    const weightValue = parseFloat(newWeight);
    if (isNaN(weightValue) || weightValue <= 0) {
      showToastMessage('⚠️ Ingresa un peso válido');
      return;
    }

    const { exercise, dayOfWeek, date } = editingWeight;
    const originalName = exercise.originalName || exercise.name;
    const key = `${dayOfWeek}-${originalName}`;
    const absoluteWeek = getAbsoluteWeek(date);

    // Filtrar entradas existentes con la misma fecha para evitar duplicados
    const existingWeights = customWeights[key] || [];
    const filteredWeights = existingWeights.filter(item => item.fromDate !== date);

    // Crear el objeto actualizado con el nuevo peso personalizado
    const updatedCustomWeights = {
      ...customWeights,
      [key]: [
        ...filteredWeights,
        {
          weight: weightValue,
          fromDate: date,
          absoluteWeek: absoluteWeek
        }
      ]
    };

    console.log('💪 Guardando peso personalizado:', {
      key,
      date,
      weight: weightValue,
      absoluteWeek,
      allWeights: updatedCustomWeights[key]
    });

    // Actualizar el estado
    setCustomWeights(updatedCustomWeights);

    // Recargar los datos del día actual con los pesos actualizados INMEDIATAMENTE
    const trainingData = getTrainingDataForDate(date, dayOfWeek, customExerciseNames, updatedCustomWeights);
    setSelectedDate({
      date: date,
      dayOfWeek: dayOfWeek,
      data: trainingData
    });

    // Cerrar el modal y mostrar confirmación
    setEditingWeight(null);
    setNewWeight('');
    showToastMessage('✓ Peso actualizado correctamente');
  };

  // Cancelar edición de peso
  const cancelWeightEdit = () => {
    setEditingWeight(null);
    setNewWeight('');
  };

  // Manejar el botón "atrás" del navegador
  useEffect(() => {
    const handlePopState = (event) => {
      // Cuando el usuario presiona "atrás", volver al calendario
      if (currentScreen === 'WorkoutDetail') {
        goBack();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentScreen]);

  // Pantalla de error
  if (error) {
    return (
      <div className="app">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '20px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px' }}>⚠️</div>
          <h2 style={{ color: '#ff6b35' }}>Error de Conexión</h2>
          <p style={{ color: '#fff', maxWidth: '400px' }}>
            No se pudo conectar a Firebase. Por favor verifica tu conexión a internet.
          </p>
          <p style={{ color: '#888', fontSize: '14px', maxWidth: '400px' }}>
            {error.details}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              backgroundColor: '#ff6b35',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de carga
  if (isLoading) {
    return (
      <div className="app">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ fontSize: '48px' }}>🏋️</div>
          <h2 style={{ color: '#fff' }}>Cargando...</h2>
        </div>
      </div>
    );
  }

  // Pantalla de Calendario
  if (currentScreen === 'Calendar') {
    return (
      <div className="app">
        <header className="header">
          <h1 className="title">Mi Entreno</h1>
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
            <ExerciseCard 
              key={index} 
              exercise={exercise} 
              index={index}
              color={currentData.color}
              onLongPress={handleLongPress}
              onWeightLongPress={handleWeightLongPress}
            />
          ))}
        </div>
      </div>

      {/* Modal de edición de nombre de ejercicio */}
      {editingExercise && (
        <div className="modal-overlay" onClick={cancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Editar nombre del ejercicio</h3>
            <p className="modal-subtitle">Los cambios se aplicarán desde este día en adelante</p>
            
            <input
              type="text"
              className="modal-input"
              value={newExerciseName}
              onChange={(e) => setNewExerciseName(e.target.value)}
              placeholder="Nombre del ejercicio"
              autoFocus
            />
            
            <div className="modal-buttons">
              <button className="modal-button cancel" onClick={cancelEdit}>
                Cancelar
              </button>
              <button 
                className="modal-button save" 
                onClick={saveCustomExerciseName}
                style={{ backgroundColor: currentData?.color }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición de peso */}
      {editingWeight && (
        <div className="modal-overlay" onClick={cancelWeightEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Editar peso del ejercicio</h3>
            <p className="modal-subtitle">
              Los pesos se recalcularán desde este día en adelante siguiendo la progresión
            </p>
            
            <div className="weight-input-container">
              <input
                type="number"
                className="modal-input weight-input"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Peso en kg"
                step="0.5"
                min="0"
                autoFocus
              />
              <span className="weight-unit">kg</span>
            </div>
            
            <div className="modal-buttons">
              <button className="modal-button cancel" onClick={cancelWeightEdit}>
                Cancelar
              </button>
              <button 
                className="modal-button save" 
                onClick={saveCustomWeight}
                style={{ backgroundColor: currentData?.color }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer" style={{ borderTopColor: currentData?.color }}>
        <button 
          className={`complete-button ${isCompleted ? 'completed' : ''}`}
          onClick={toggleCompleted}
        >
          {isCompleted ? '✓ Completado' : '✓ Marcar como Completado'}
        </button>
      </footer>

      {/* Toast de confirmación */}
      {showToast && (
        <div className="toast">
          {toastMessage}
        </div>
      )}
      </div>
  );
}

export default App;
