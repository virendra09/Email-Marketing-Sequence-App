const express = require('express');
const router = express.Router();
const Sequence = require('../models/Sequence');
const { agenda } = require('../agenda');

// Get all sequences
router.get('/', async (req, res) => {
  try {
    const sequences = await Sequence.find().sort({ updatedAt: -1 });
    res.json(sequences);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sequences' });
  }
});

// Get a specific sequence
router.get('/:id', async (req, res) => {
  try {
    const sequence = await Sequence.findById(req.params.id);
    if (!sequence) {
      return res.status(404).json({ error: 'Sequence not found' });
    }
    res.json(sequence);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sequence' });
  }
});

// Create a new sequence
router.post('/', async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;
    const sequence = new Sequence({
      name,
      nodes,
      edges
    });
    await sequence.save();

    // Schedule emails based on the sequence
    scheduleEmails(sequence);

    res.status(201).json(sequence);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sequence' });
  }
});

// Update a sequence
router.put('/:id', async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;
    const sequence = await Sequence.findByIdAndUpdate(
      req.params.id,
      { name, nodes, edges },
      { new: true }
    );
    if (!sequence) {
      return res.status(404).json({ error: 'Sequence not found' });
    }

    // Cancel existing jobs and reschedule
    await agenda.cancel({ 'data.sequenceId': req.params.id });
    scheduleEmails(sequence);

    res.json(sequence);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update sequence' });
  }
});

// Delete a sequence
router.delete('/:id', async (req, res) => {
  try {
    const sequence = await Sequence.findByIdAndDelete(req.params.id);
    if (!sequence) {
      return res.status(404).json({ error: 'Sequence not found' });
    }

    // Cancel all jobs for this sequence
    await agenda.cancel({ 'data.sequenceId': req.params.id });

    res.json({ message: 'Sequence deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete sequence' });
  }
});

// Helper function to schedule emails
async function scheduleEmails(sequence) {
  const startNode = sequence.nodes.find(node => node.type === 'input');
  if (!startNode) return;

  let currentNode = startNode;
  let totalDelay = 0;

  while (currentNode) {
    const outgoingEdge = sequence.edges.find(edge => edge.source === currentNode.id);
    if (!outgoingEdge) break;

    const nextNode = sequence.nodes.find(node => node.id === outgoingEdge.target);
    if (!nextNode) break;

    if (nextNode.type === 'wait') {
      totalDelay += (parseInt(nextNode.data.duration) || 1) * 3600000; // Convert hours to milliseconds
    } else if (nextNode.type === 'coldEmail') {
      // Schedule email
      await agenda.schedule(
        new Date(Date.now() + totalDelay),
        'send email',
        {
          sequenceId: sequence._id,
          nodeId: nextNode.id,
          subject: nextNode.data.subject,
          body: nextNode.data.body
        }
      );
    }

    currentNode = nextNode;
  }
}

module.exports = router; 