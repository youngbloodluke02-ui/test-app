import { useState } from "react";
import { createEmptyProgram, createExercise } from "../lib/model";

function ExerciseRow({ exercise, onChange, onRemove }) {
  return (
    <div className="exercise-row">
      <input
        type="text"
        placeholder="Exercise name"
        value={exercise.name}
        onChange={(e) => onChange({ ...exercise, name: e.target.value })}
        className="exercise-name-input"
      />
      <div className="exercise-numbers">
        <label>
          <span>Sets</span>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            value={exercise.targetSets}
            onChange={(e) => onChange({ ...exercise, targetSets: Number(e.target.value) })}
          />
        </label>
        <label>
          <span>Reps</span>
          <div className="rep-range">
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={exercise.targetRepRange.min}
              onChange={(e) =>
                onChange({ ...exercise, targetRepRange: { ...exercise.targetRepRange, min: Number(e.target.value) } })
              }
            />
            <span>–</span>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={exercise.targetRepRange.max}
              onChange={(e) =>
                onChange({ ...exercise, targetRepRange: { ...exercise.targetRepRange, max: Number(e.target.value) } })
              }
            />
          </div>
        </label>
        <button type="button" className="btn-danger remove-exercise" onClick={onRemove} aria-label="Remove exercise">
          ✕
        </button>
      </div>
    </div>
  );
}

function WorkoutEditor({ workout, onChange }) {
  function updateExercise(index, next) {
    const exercises = workout.exercises.slice();
    exercises[index] = next;
    onChange({ ...workout, exercises });
  }

  function removeExercise(index) {
    onChange({ ...workout, exercises: workout.exercises.filter((_, i) => i !== index) });
  }

  function addExercise() {
    onChange({ ...workout, exercises: [...workout.exercises, createExercise()] });
  }

  return (
    <div className="workout-editor">
      {workout.exercises.map((ex, i) => (
        <ExerciseRow
          key={ex.id}
          exercise={ex}
          onChange={(next) => updateExercise(i, next)}
          onRemove={() => removeExercise(i)}
        />
      ))}
      <button type="button" className="btn btn-secondary add-exercise-btn" onClick={addExercise}>
        + Add exercise
      </button>
    </div>
  );
}

export default function ProgramSetup({ program, onSave }) {
  const [draft, setDraft] = useState(program ?? createEmptyProgram());
  const [variant, setVariant] = useState("A");
  const [saved, setSaved] = useState(false);

  function updateField(field, value) {
    setDraft({ ...draft, [field]: value });
    setSaved(false);
  }

  function updateWorkout(key, next) {
    setDraft({ ...draft, workouts: { ...draft.workouts, [key]: next } });
    setSaved(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const cleaned = {
      ...draft,
      workouts: {
        A: { ...draft.workouts.A, exercises: draft.workouts.A.exercises.filter((ex) => ex.name.trim()) },
        B: { ...draft.workouts.B, exercises: draft.workouts.B.exercises.filter((ex) => ex.name.trim()) },
      },
    };
    onSave(cleaned);
    setDraft(cleaned);
    setSaved(true);
  }

  const canSave =
    draft.name.trim() &&
    draft.workouts.A.exercises.some((ex) => ex.name.trim()) &&
    draft.workouts.B.exercises.some((ex) => ex.name.trim());

  return (
    <div>
      <p className="eyebrow">Program setup</p>
      <h1>{program ? "Edit your program" : "Build your program"}</h1>
      <p className="page-subtitle">
        Define the structure once. Weeks, weekly sessions, and the exercise list for Workout A and Workout B.
      </p>

      <form onSubmit={handleSubmit} className="setup-form">
        <div className="card">
          <div className="field-grid">
            <div className="field">
              <label htmlFor="program-name">Program name</label>
              <input
                id="program-name"
                type="text"
                placeholder="e.g. Recomp — Summer"
                value={draft.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="start-date">Start date</label>
              <input
                id="start-date"
                type="date"
                value={draft.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="total-weeks">Total weeks</label>
              <input
                id="total-weeks"
                type="number"
                inputMode="numeric"
                min="1"
                value={draft.totalWeeks}
                onChange={(e) => updateField("totalWeeks", Number(e.target.value))}
              />
            </div>
            <div className="field">
              <label htmlFor="sessions-per-week">Sessions / week</label>
              <input
                id="sessions-per-week"
                type="number"
                inputMode="numeric"
                min="1"
                max="7"
                value={draft.sessionsPerWeek}
                onChange={(e) => updateField("sessionsPerWeek", Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="variant-tabs" role="tablist">
            {["A", "B"].map((key) => (
              <button
                type="button"
                key={key}
                role="tab"
                aria-selected={variant === key}
                className={"variant-tab" + (variant === key ? " active" : "")}
                onClick={() => setVariant(key)}
              >
                Workout {key}
              </button>
            ))}
          </div>
          <WorkoutEditor
            workout={draft.workouts[variant]}
            onChange={(next) => updateWorkout(variant, next)}
          />
        </div>

        <button type="submit" className="btn btn-primary save-btn" disabled={!canSave}>
          {program ? "Save changes" : "Save program"}
        </button>
        {saved && <p className="save-confirm">Saved — your program is stored on this device.</p>}
      </form>
    </div>
  );
}
