import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Trash, GripVertical, Save } from "lucide-react";

// Lightweight UI with improved coloring and focus states
const Button = ({ children, className = "", variant = "primary", ...p }) => {
  const variants = {
    primary: "bg-slate-800 text-white hover:bg-slate-900",
    secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
    success: "bg-green-600 text-white hover:bg-green-700",
    warning: "bg-amber-500 text-white hover:bg-amber-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  };
  return (
    <button
      {...p}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-md shadow-sm text-sm font-medium transition-colors ${
        variants[variant] || variants.primary
      } ${className}`}
    >
      {children}
    </button>
  );
};
const Input = (p) => (
  <input
    {...p}
    className={`border border-slate-300 rounded-md px-2 py-1 text-sm bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition ${
      p.className || "w-full"
    }`}
  />
);
const TextArea = (p) => (
  <textarea
    {...p}
    className={`border border-slate-300 rounded-md px-2 py-1 text-sm bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition ${
      p.className || "w-full"
    }`}
  />
);

function getPhaseTheme(phase) {
  const label = (phase.label || "").toLowerCase();
  const type = (phase.type || "").toLowerCase();
  if (label.includes("warm")) return { card: "bg-amber-50 border-amber-200", headerDot: "bg-amber-400" };
  if (label.includes("cool")) return { card: "bg-sky-50 border-sky-200", headerDot: "bg-sky-400" };
  if (label.includes("finish")) return { card: "bg-rose-50 border-rose-200", headerDot: "bg-rose-400" };
  if (type === "superset") return { card: "bg-violet-50 border-violet-200", headerDot: "bg-violet-400" };
  if (type === "circuit") return { card: "bg-emerald-50 border-emerald-200", headerDot: "bg-emerald-400" };
  if (label.includes("strength")) return { card: "bg-indigo-50 border-indigo-200", headerDot: "bg-indigo-400" };
  return { card: "bg-white border-slate-200", headerDot: "bg-slate-300" };
}

// Simple uid helper
const uid = () => Math.random().toString(36).slice(2, 9);

// reorder helper
function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

// move between lists
function move(source, destination, sourceIdx, destIdx) {
  const src = Array.from(source);
  const dst = Array.from(destination);
  const [removed] = src.splice(sourceIdx, 1);
  dst.splice(destIdx, 0, removed);
  return { source: src, destination: dst };
}

export default function ProgramEditor({ initialProgram, onSaveProgram }) {
  const [program, setProgram] = useState(
    initialProgram || {
      title: "",
      day: "",
      focus: "",
      rest_between_phase: null,
      is_template: false,
      archived_at: null,
      phases: [],
    }
  );
  // const [editing, setEditing] = useState({}); // map of itemId -> boolean for inline editing
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialProgram) setProgram(initialProgram);
  }, [initialProgram]);

  // Phase CRUD
  function addPhase() {
    const p = {
      id: uid(),
      label: "New Phase",
      type: "linear",
      rest_between_exercise: null,
      rest_between_sets: null,
      rounds: null,
      rest_between_rounds: null,
      position: program.phases.length,
      exercises: [],
      groups: [],
    };
    setProgram((prev) => ({ ...prev, phases: [...prev.phases, p] }));
  }
  function updatePhase(phaseId, patch) {
    setProgram((prev) => ({
      ...prev,
      phases: prev.phases.map((ph) => (ph.id === phaseId ? { ...ph, ...patch } : ph)),
    }));
  }
  function deletePhase(phaseId) {
    setProgram((prev) => ({ ...prev, phases: prev.phases.filter((p) => p.id !== phaseId) }));
  }

  // Group CRUD
  function addGroup(phaseId) {
    const phase = program.phases.find((p) => p.id === phaseId);
    if (!phase || (phase.type && phase.type !== "superset")) {
      return;
    }
    const g = {
      id: uid(),
      name: "New Group",
      sets: 3,
      rest_between_sets: null,
      rest_between_exercise: null,
      position: 0,
      exercises: [],
    };
    setProgram((prev) => ({
      ...prev,
      phases: prev.phases.map((ph) => (ph.id === phaseId ? { ...ph, groups: [...ph.groups, { ...g, position: ph.groups.length }] } : ph)),
    }));
  }
  function updateGroup(phaseId, groupId, patch) {
    setProgram((prev) => ({
      ...prev,
      phases: prev.phases.map((ph) =>
        ph.id === phaseId
          ? { ...ph, groups: ph.groups.map((g) => (g.id === groupId ? { ...g, ...patch } : g)) }
          : ph
      ),
    }));
  }
  function deleteGroup(phaseId, groupId) {
    setProgram((prev) => ({
      ...prev,
      phases: prev.phases.map((ph) => (ph.id === phaseId ? { ...ph, groups: ph.groups.filter((g) => g.id !== groupId) } : ph)),
    }));
  }

  // Exercise CRUD
  function addExercise(phaseId, groupId) {
    const ex = {
      id: uid(),
      exercise_name: "New Exercise",
      duration: null,
      notes: "",
      position: 0,
    };
    setProgram((prev) => ({
      ...prev,
      phases: prev.phases.map((ph) =>
        ph.id === phaseId
          ? {
              ...ph,
              groups: groupId
                ? ph.groups.map((g) => (g.id === groupId ? { ...g, exercises: [...g.exercises, { ...ex, position: g.exercises.length }] } : g))
                : ph.groups,
              exercises: !groupId ? [...(ph.exercises || []), { ...ex, position: (ph.exercises || []).length }] : (ph.exercises || []),
            }
          : ph
      ),
    }));
  }
  function updateExercise(phaseId, groupId, exerciseId, patch) {
    setProgram((prev) => ({
      ...prev,
      phases: prev.phases.map((ph) =>
        ph.id === phaseId
          ? {
              ...ph,
              groups: groupId
                ? ph.groups.map((g) =>
                    g.id === groupId ? { ...g, exercises: g.exercises.map((e) => (e.id === exerciseId ? { ...e, ...patch } : e)) } : g
                  )
                : ph.groups,
              exercises: !groupId ? (ph.exercises || []).map((e) => (e.id === exerciseId ? { ...e, ...patch } : e)) : (ph.exercises || []),
            }
          : ph
      ),
    }));
  }
  function deleteExercise(phaseId, groupId, exerciseId) {
    setProgram((prev) => ({
      ...prev,
      phases: prev.phases.map((ph) =>
        ph.id === phaseId
          ? {
              ...ph,
              groups: groupId
                ? ph.groups.map((g) => (g.id === groupId ? { ...g, exercises: g.exercises.filter((e) => e.id !== exerciseId) } : g))
                : ph.groups,
              exercises: !groupId ? (ph.exercises || []).filter((e) => e.id !== exerciseId) : (ph.exercises || []),
            }
          : ph
      ),
    }));
  }

  // Drag end handling
  function onDragEnd(result) {
    const { source, destination, type } = result;
    if (!destination) return;

    // reorder phases
    if (type === "PHASE") {
      const reordered = reorder(program.phases, source.index, destination.index).map((p, i) => ({ ...p, position: i }));
      setProgram((prev) => ({ ...prev, phases: reordered }));
      return;
    }

    // group dragging: droppableId like `groups-<phaseId>`
    if (type === "GROUP") {
      const srcPhaseId = source.droppableId.split("groups-")[1];
      const dstPhaseId = destination.droppableId.split("groups-")[1];
      const srcPhase = program.phases.find((p) => p.id === srcPhaseId);
      const dstPhase = program.phases.find((p) => p.id === dstPhaseId);
      if (!srcPhase || !dstPhase) return;

      if (srcPhaseId === dstPhaseId) {
        const newGroups = reorder(srcPhase.groups, source.index, destination.index).map((g, i) => ({ ...g, position: i }));
        updatePhase(srcPhaseId, { groups: newGroups });
      } else {
        const res = move(srcPhase.groups, dstPhase.groups, source.index, destination.index);
        const updatedPhases = program.phases.map((ph) => {
          if (ph.id === srcPhaseId) return { ...ph, groups: res.source.map((g, i) => ({ ...g, position: i })) };
          if (ph.id === dstPhaseId) return { ...ph, groups: res.destination.map((g, i) => ({ ...g, position: i })) };
          return ph;
        });
        setProgram((prev) => ({ ...prev, phases: updatedPhases }));
      }
      return;
    }

    // exercise dragging: droppableId like `ex-<phaseId>-<groupId>`
    if (type === "EXERCISE") {
      const [, srcPhaseId, srcGroupId] = source.droppableId.split("ex-")[1].split("-");
      const [, dstPhaseId, dstGroupId] = destination.droppableId.split("ex-")[1].split("-");

      const srcPhase = program.phases.find((p) => p.id === srcPhaseId);
      const dstPhase = program.phases.find((p) => p.id === dstPhaseId);
      if (!srcPhase || !dstPhase) return;
      const srcGroup = srcPhase.groups.find((g) => g.id === srcGroupId);
      const dstGroup = dstPhase.groups.find((g) => g.id === dstGroupId);
      if (!srcGroup || !dstGroup) return;

      if (srcGroupId === dstGroupId && srcPhaseId === dstPhaseId) {
        const newExercises = reorder(srcGroup.exercises, source.index, destination.index).map((e, i) => ({ ...e, position: i }));
        updateGroup(srcPhaseId, srcGroupId, { exercises: newExercises });
      } else {
        const res = move(srcGroup.exercises, dstGroup.exercises, source.index, destination.index);
        const updatedPhases = program.phases.map((ph) => {
          if (ph.id === srcPhaseId) return { ...ph, groups: ph.groups.map((g) => (g.id === srcGroupId ? { ...g, exercises: res.source.map((e, i) => ({ ...e, position: i })) } : g)) };
          if (ph.id === dstPhaseId) return { ...ph, groups: ph.groups.map((g) => (g.id === dstGroupId ? { ...g, exercises: res.destination.map((e, i) => ({ ...e, position: i })) } : g)) };
          return ph;
        });
        setProgram((prev) => ({ ...prev, phases: updatedPhases }));
      }
      return;
    }

    // phase-level exercise dragging: droppableId like `pex-<phaseId>`
    if (type === "PEXERCISE") {
      const srcPhaseId = source.droppableId.split("pex-")[1];
      const dstPhaseId = destination.droppableId.split("pex-")[1];
      if (!srcPhaseId || !dstPhaseId || srcPhaseId !== dstPhaseId) return;
      const phase = program.phases.find((p) => p.id === srcPhaseId);
      if (!phase) return;
      const newExercises = reorder(phase.exercises || [], source.index, destination.index).map((e, i) => ({ ...e, position: i }));
      updatePhase(srcPhaseId, { exercises: newExercises });
      return;
    }
  }

  async function saveProgram() {
    setIsSaving(true);
    try {
      if (onSaveProgram) await onSaveProgram(program);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="mb-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input placeholder="Program Title" value={program.title} onChange={(e) => setProgram({ ...program, title: e.target.value })} className="md:col-span-2" />
          <Input placeholder="Day (e.g. Monday)" value={program.day} onChange={(e) => setProgram({ ...program, day: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-slate-300">
            RBP
            <Input type="number" value={program.rest_between_phase ?? ""} onChange={(e) => setProgram({ ...program, rest_between_phase: e.target.value ? Number(e.target.value) : null })} className="w-28" />
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
          <Input placeholder="Focus (short description)" value={program.focus || ""} onChange={(e) => setProgram({ ...program, focus: e.target.value })} className="md:col-span-3" />
          <label className="inline-flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={!!program.is_template} onChange={(e) => setProgram({ ...program, is_template: e.target.checked })} />
            Template
          </label>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={addPhase} variant="primary"><Plus /> Add Phase</Button>
          <Button onClick={saveProgram} variant="success" disabled={isSaving}><Save /> {isSaving ? 'Saving...' : 'Save'}</Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-phases" type="PHASE">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
              {program.phases.map((phase, phaseIndex) => (
                <Draggable key={phase.id} draggableId={phase.id} index={phaseIndex}>
                  {(prov) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      className={`border rounded-md p-3 shadow-sm ${getPhaseTheme(phase).card} text-slate-900`}
                    >
                      <div className="flex items-start gap-3">
                        <div {...prov.dragHandleProps} className="p-1 cursor-grab"><GripVertical /></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Input value={phase.label} onChange={(e) => updatePhase(phase.id, { label: e.target.value })} className="font-semibold text-lg" />
                              <select value={phase.type} onChange={(e) => updatePhase(phase.id, { type: e.target.value })} className="border rounded px-2 py-1 text-sm">
                                <option value="linear">Linear</option>
                                <option value="superset">Superset</option>
                                <option value="circuit">Circuit</option>
                              </select>
                              <div className={`inline-flex items-center gap-2 text-xs px-2 py-0.5 rounded-full bg-white/70 text-slate-700 border ${getPhaseTheme(phase).card.split(' ').find(c=>c.startsWith('border-'))}`}>
                                <span className={`w-2 h-2 rounded-full ${getPhaseTheme(phase).headerDot}`}></span>
                                {phase.type}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {phase.type === 'superset' && (
                                <Button variant="warning" onClick={() => addGroup(phase.id)}><Plus /> Group</Button>
                              )}
                              {phase.type !== 'superset' && (
                                <Button variant="primary" onClick={() => addExercise(phase.id)}><Plus /> Add Exercise</Button>
                              )}
                              <Button variant="danger" onClick={() => deletePhase(phase.id)}><Trash /></Button>
                            </div>
                          </div>

                          {/* Phase attributes */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs text-slate-300">
                            <label className="flex items-center gap-2">RBE
                              <Input
                                type="number"
                                value={phase.rest_between_exercise ?? ""}
                                onChange={(e) => updatePhase(phase.id, { rest_between_exercise: e.target.value ? Number(e.target.value) : null })}
                                className="w-24"
                              />
                            </label>
                            <label className="flex items-center gap-2">RBS
                              <Input
                                type="number"
                                value={phase.rest_between_sets ?? ""}
                                onChange={(e) => updatePhase(phase.id, { rest_between_sets: e.target.value ? Number(e.target.value) : null })}
                                className="w-24"
                              />
                            </label>
                            <label className="flex items-center gap-2">Rounds
                              <Input
                                type="number"
                                value={phase.rounds ?? ""}
                                onChange={(e) => updatePhase(phase.id, { rounds: e.target.value ? Number(e.target.value) : null })}
                                className="w-24"
                              />
                            </label>
                            <label className="flex items-center gap-2">RBR
                              <Input
                                type="number"
                                value={phase.rest_between_rounds ?? ""}
                                onChange={(e) => updatePhase(phase.id, { rest_between_rounds: e.target.value ? Number(e.target.value) : null })}
                                className="w-24"
                              />
                            </label>
                          </div>

                          <div className="mt-3">
                            {phase.type === 'superset' ? (
                              <Droppable droppableId={`groups-${phase.id}`} type="GROUP">
                                {(provGroups) => (
                                  <div ref={provGroups.innerRef} {...provGroups.droppableProps} className="space-y-2">
                                    {phase.groups.map((group, groupIndex) => (
                                      <Draggable key={group.id} draggableId={group.id} index={groupIndex}>
                                        {(provGroup) => (
                                          <div ref={provGroup.innerRef} {...provGroup.draggableProps} className="border border-slate-200 rounded p-2 bg-white/80 text-slate-900">
                                            <div className="flex items-center gap-2">
                                              <div {...provGroup.dragHandleProps} className="p-1 cursor-grab"><GripVertical /></div>
                                              <div className="flex-1">
                                                <Input value={group.name} onChange={(e) => updateGroup(phase.id, group.id, { name: e.target.value })} />
                                                <div className="grid grid-cols-3 gap-2 text-xs mt-1 text-slate-600">
                                                  <div>Sets: <Input value={group.sets} onChange={(e) => updateGroup(phase.id, group.id, { sets: Number(e.target.value) })} className="inline w-20" /></div>
                                                  <div>RBS: <Input value={group.rest_between_sets ?? ""} onChange={(e) => updateGroup(phase.id, group.id, { rest_between_sets: e.target.value ? Number(e.target.value) : null })} className="inline w-24" /></div>
                                                  <div>RBE: <Input value={group.rest_between_exercise ?? ""} onChange={(e) => updateGroup(phase.id, group.id, { rest_between_exercise: e.target.value ? Number(e.target.value) : null })} className="inline w-24" /></div>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Button variant="primary" onClick={() => addExercise(phase.id, group.id)}><Plus /> Add Exercise</Button>
                                                <Button variant="danger" onClick={() => deleteGroup(phase.id, group.id)}><Trash /></Button>
                                              </div>
                                            </div>

                                            <div className="mt-2">
                                              <Droppable droppableId={`ex-${phase.id}-${group.id}`} type="EXERCISE">
                                                {(provEx) => (
                                                  <div ref={provEx.innerRef} {...provEx.droppableProps} className="space-y-1">
                                                    {group.exercises.map((ex, exIndex) => (
                                                      <Draggable key={ex.id} draggableId={ex.id} index={exIndex}>
                                                        {(provExItem) => (
                                                          <div
                                                            ref={provExItem.innerRef}
                                                            {...provExItem.draggableProps}
                                                            className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 hover:bg-slate-50 transition text-slate-900"
                                                          >
                                                            <div {...provExItem.dragHandleProps} className="p-1 cursor-grab"><GripVertical /></div>
                                                            <div className="flex-1">
                                                              <Input value={ex.exercise_name} onChange={(e) => updateExercise(phase.id, group.id, ex.id, { exercise_name: e.target.value })} />
                                                              <div className="text-xs mt-1 text-slate-600">Duration: <Input value={ex.duration || ""} onChange={(e) => updateExercise(phase.id, group.id, ex.id, { duration: e.target.value ? Number(e.target.value) : null })} className="inline w-20" /></div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                              <Button onClick={() => deleteExercise(phase.id, group.id, ex.id)} variant="danger"><Trash /></Button>
                                                            </div>
                                                          </div>
                                                        )}
                                                      </Draggable>
                                                    ))}
                                                    {provEx.placeholder}
                                                  </div>
                                                )}
                                              </Droppable>
                                            </div>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provGroups.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            ) : (
                              <Droppable droppableId={`pex-${phase.id}`} type="PEXERCISE">
                                {(provExPhase) => (
                                  <div ref={provExPhase.innerRef} {...provExPhase.droppableProps} className="space-y-2">
                                    {(phase.exercises || []).map((ex, exIndex) => (
                                      <Draggable key={ex.id} draggableId={ex.id} index={exIndex}>
                                        {(provExItem) => (
                                          <div
                                            ref={provExItem.innerRef}
                                            {...provExItem.draggableProps}
                                            className="flex items-start gap-2 p-2 bg-white rounded border border-slate-200 hover:bg-slate-50 transition text-slate-900"
                                          >
                                            <div {...provExItem.dragHandleProps} className="p-1 cursor-grab"><GripVertical /></div>
                                            <div className="flex-1 space-y-1">
                                              <Input value={ex.exercise_name} onChange={(e) => updateExercise(phase.id, null, ex.id, { exercise_name: e.target.value })} />
                                              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                                                <div>Duration: <Input value={ex.duration || ""} onChange={(e) => updateExercise(phase.id, null, ex.id, { duration: e.target.value ? Number(e.target.value) : null })} className="inline w-24" /></div>
                                                <div className="col-span-2 sm:col-span-1 w-full">Notes:</div>
                                              </div>
                                              <TextArea value={ex.notes || ""} onChange={(e) => updateExercise(phase.id, null, ex.id, { notes: e.target.value })} />
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <Button onClick={() => deleteExercise(phase.id, null, ex.id)} variant="danger"><Trash /></Button>
                                            </div>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provExPhase.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
